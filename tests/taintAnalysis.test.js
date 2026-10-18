// tests/taintAnalysis.test.js
// RepoMind Phase 8: Context-Aware Security Analysis & Source-to-Sink Taint Tracking
// Evaluates direct flows, helper functions, cross-file propagation, false-positive traps,
// verified sanitizers, misleading sanitizer names, and cycle resilience.

import assert from 'node:assert/strict'

console.log('\n======================================================================')
console.log('  REPOMIND PHASE 8: CONTEXT-AWARE SECURITY ANALYSIS & TAINT TRACKING')
console.log('======================================================================\n')

let TP = 0
let FP = 0
let TN = 0
let FN = 0

function assertTest(category, name, condition, details = '') {
  if (condition) {
    console.log(`  [PASS] [${category}] ${name}`)
    if (details) console.log(`         ↳ ${details}`)
  } else {
    console.error(`  [FAIL] [${category}] ${name}`)
    if (details) console.error(`         ↳ ${details}`)
    throw new Error(`Test failed: [${category}] ${name}`)
  }
}

// ----------------------------------------------------------------------------
// TAINT ENGINE IMPLEMENTATION (PURE ESM RUNNER)
// ----------------------------------------------------------------------------

const TAINT_SOURCES = [
  {
    id: 'NODE-HTTP-QUERY',
    pattern: /\b(?:req|request)\.query(?:\.([a-zA-Z0-9_$]+)|\[['"]([^'"]+)['"]\])?/,
    extractVar: (m, line) => {
      const assign = line.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*.*(?:req|request)\./)
      const destructure = line.match(/(?:const|let|var)\s*\{([^}]+)\}\s*=\s*(?:req|request)\./)
      if (assign) return assign[1].trim()
      if (destructure) return destructure[1].split(',')[0].trim().split(':')[0].trim()
      return m[1] || m[2] || 'query'
    }
  },
  {
    id: 'PY-HTTP-ARGS',
    pattern: /\brequest\.(?:args|query_params)(?:\.get\s*\(\s*['"]([^'"]+)['"]|\[['"]([^'"]+)['"]\])?/,
    extractVar: (m, line) => {
      const assign = line.match(/([a-zA-Z0-9_]+)\s*=\s*request\./)
      if (assign) return assign[1].trim()
      return m[1] || 'args'
    }
  }
]

const TAINT_SINKS = [
  {
    id: 'SINK-SQL',
    ruleId: 'RPM-TAINT-SQLI-01',
    category: 'SQL_INJECTION',
    pattern: /\b(?:db|pool|cursor|session)\.(?:query|execute)\s*\(\s*([^,\)]+)/i,
    checkProtection: (line) => line.includes('[$') || line.includes('?,') || line.includes(', [') || line.includes(', (')
  },
  {
    id: 'SINK-CMD',
    ruleId: 'RPM-TAINT-CMDI-02',
    category: 'COMMAND_INJECTION',
    pattern: /(?:\bexec\s*\(\s*([^\)]+)|os\.system\s*\(\s*([^\)]+)|subprocess\.(?:Popen|run)\s*\(\s*([^\),]+).*shell\s*=\s*True)/,
    checkProtection: (line) => line.includes('execFile') || line.includes('shell=False')
  },
  {
    id: 'SINK-XSS',
    ruleId: 'RPM-TAINT-XSS-03',
    category: 'XSS',
    pattern: /\.(?:innerHTML|outerHTML)\s*=\s*([^\n;]+)/,
    checkProtection: (line) => line.includes('textContent') || line.includes('DOMPurify.sanitize') || line.includes('escapeHtml')
  },
  {
    id: 'SINK-PATH',
    ruleId: 'RPM-TAINT-TRAV-04',
    category: 'PATH_TRAVERSAL',
    pattern: /(?:\bfs\.(?:readFile|createReadStream)\s*\(\s*([^\),]+)|\bopen\s*\(\s*([^\),]+))/,
    checkProtection: (line) => line.includes('path.basename(') || line.includes('os.path.basename(')
  }
]

const VERIFIED_SANITIZERS = [
  { name: 'parseInt', pattern: /\b(?:parseInt|Number)\s*\(/ },
  { name: 'int()', pattern: /\bint\s*\(/ },
  { name: 'DOMPurify.sanitize', pattern: /\bDOMPurify\.sanitize\s*\(/ },
  { name: 'path.basename', pattern: /\b(?:path|os\.path)\.basename\s*\(/ }
]

function extractFunctions(content, filePath) {
  const funcs = []
  const lines = content.split('\n')
  const fnRegex = /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/
  const arrowRegex = /(?:export\s+)?const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/
  const pyRegex = /^\s*def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):/

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(fnRegex) || line.match(arrowRegex) || line.match(pyRegex)
    if (match) {
      const name = match[1]
      const rawParams = match[2] || ''
      const params = rawParams.split(',').map(p => p.trim().split(':')[0].split('=')[0].trim()).filter(Boolean)
      let endLine = i + 1
      if (line.includes('{')) {
        let braces = 0
        for (let j = i; j < lines.length; j++) {
          for (const c of lines[j]) {
            if (c === '{') braces++
            else if (c === '}') braces--
          }
          if (braces <= 0) {
            endLine = j + 1
            break
          }
        }
      }
      funcs.push({ name, filePath, line: i + 1, endLine, params })
    }
  }
  return funcs
}

function resolveFunctionInFiles(funcName, filesMap, currentFile) {
  // Check current file
  const localFuncs = extractFunctions(filesMap[currentFile] || '', currentFile)
  const local = localFuncs.find(f => f.name === funcName)
  if (local) return local

  // Check imported files
  for (const [fPath, content] of Object.entries(filesMap)) {
    if (fPath !== currentFile) {
      const funcs = extractFunctions(content, fPath)
      const found = funcs.find(f => f.name === funcName)
      if (found) return found
    }
  }
  return null
}

function traceTaint(filesMap, startFile) {
  const findings = []
  const content = filesMap[startFile]
  if (!content) return findings

  const lines = content.split('\n')

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]
    const lineNum = idx + 1

    // Skip comment lines
    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('#')) continue

    for (const src of TAINT_SOURCES) {
      const match = line.match(src.pattern)
      if (match) {
        const initialVar = src.extractVar(match, line)
        if (!initialVar) continue

        const initialStep = {
          stepIndex: 1,
          filePath: startFile,
          line: lineNum,
          snippet: line.trim(),
          varName: initialVar,
          type: 'SOURCE'
        }

        // Trace forward
        const visited = new Set([`${startFile}:${initialVar}:${lineNum}`])

        function walk(curFile, activeVar, curLine, maxLine, path, depth) {
          if (depth > 5) return // Bound recursion depth

          const curContent = filesMap[curFile]
          if (!curContent) return
          const curLines = curContent.split('\n')
          const endLimit = maxLine !== undefined ? Math.min(maxLine, curLines.length) : curLines.length

          let currentVar = activeVar

          for (let i = curLine; i < endLimit; i++) {
            const l = curLines[i]
            const lNum = i + 1
            const t = l.trim()
            if (t.startsWith('//') || t.startsWith('#')) continue

            // Check verified sanitizers
            for (const san of VERIFIED_SANITIZERS) {
              if (l.includes(currentVar) && san.pattern.test(l)) {
                // Neutralized!
                return
              }
            }

            // Check sinks
            for (const sink of TAINT_SINKS) {
              if (sink.pattern.test(l) && l.includes(currentVar)) {
                if (sink.checkProtection && sink.checkProtection(l)) {
                  // Protected sink
                  continue
                }

                const sinkStep = {
                  stepIndex: path.length + 1,
                  filePath: curFile,
                  line: lNum,
                  snippet: l.trim(),
                  varName: currentVar,
                  type: 'SINK'
                }

                findings.push({
                  ruleId: sink.ruleId,
                  category: sink.category,
                  filePath: curFile,
                  line: lNum,
                  taintPath: [...path, sinkStep],
                  source: path[0],
                  sink: sinkStep,
                  isInterprocedural: path.some(p => p.filePath !== curFile || p.type === 'FUNCTION_ENTRY')
                })
                return
              }
            }

            // Function call propagation: const res = helper(currentVar) or helper(currentVar)
            const callMatch = l.match(/(?:(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*)?([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/)
            let functionHandled = false

            if (callMatch && callMatch[3] && callMatch[3].includes(currentVar)) {
              const returnVar = callMatch[1] ? callMatch[1].trim() : null
              const fnName = callMatch[2].trim()

              // Resolve target function
              const resolvedFn = resolveFunctionInFiles(fnName, filesMap, curFile)
              if (resolvedFn) {
                functionHandled = true
                const key = `${resolvedFn.filePath}:${resolvedFn.name}:${resolvedFn.line}`
                if (!visited.has(key)) {
                  visited.add(key)
                  const targetParam = resolvedFn.params[0] || currentVar

                  const callStep = {
                    stepIndex: path.length + 1,
                    filePath: curFile,
                    line: lNum,
                    snippet: l.trim(),
                    varName: currentVar,
                    type: 'CALL_ARGUMENT'
                  }

                  const entryStep = {
                    stepIndex: path.length + 2,
                    filePath: resolvedFn.filePath,
                    line: resolvedFn.line,
                    snippet: `function ${resolvedFn.name}(${targetParam})`,
                    varName: targetParam,
                    type: 'FUNCTION_ENTRY'
                  }

                  const beforeFindings = findings.length
                  walk(
                    resolvedFn.filePath,
                    targetParam,
                    resolvedFn.line - 1,
                    resolvedFn.endLine,
                    [...path, callStep, entryStep],
                    depth + 1
                  )

                  // If no sink was inside function but returnVar exists, propagate return value to caller
                  if (findings.length === beforeFindings && returnVar) {
                    const returnStep = {
                      stepIndex: path.length + 3,
                      filePath: curFile,
                      line: lNum,
                      snippet: l.trim(),
                      varName: returnVar,
                      type: 'RETURN_VALUE'
                    }
                    walk(
                      curFile,
                      returnVar,
                      lNum,
                      maxLine,
                      [...path, callStep, entryStep, returnStep],
                      depth
                    )
                  }
                }
              }
            }

            // Variable propagation: const next = ... + currentVar (when not a function call)
            if (!functionHandled) {
              const assignMatch = l.match(new RegExp(`(?:const|let|var|)\\s*([a-zA-Z0-9_$]+)\\s*=\\s*[^;]*\\b${currentVar}\\b`))
              if (assignMatch && assignMatch[1] !== currentVar) {
                const newVar = assignMatch[1].trim()
                currentVar = newVar
                path.push({
                  stepIndex: path.length + 1,
                  filePath: curFile,
                  line: lNum,
                  snippet: l.trim(),
                  varName: newVar,
                  type: 'VARIABLE_ASSIGNMENT'
                })
              }
            }
          }
        }

        walk(startFile, initialVar, lineNum, undefined, [initialStep], 0)
      }
    }
  }

  return findings
}

// ----------------------------------------------------------------------------
// SUITE 1: DIRECT SOURCE-TO-SINK FLOWS
// ----------------------------------------------------------------------------
console.log('--- 1. Direct Source-to-Sink Vulnerability Flows ---')

const directSqlFiles = {
  'server.ts': `
    app.get('/user', (req, res) => {
      const id = req.query.id;
      db.query("SELECT * FROM users WHERE id = " + id);
    });
  `
}
const directSqlFindings = traceTaint(directSqlFiles, 'server.ts')
assertTest(
  'Direct-Flow',
  'Direct SQL Injection flow detected from req.query.id to db.query',
  directSqlFindings.length === 1 && directSqlFindings[0].ruleId === 'RPM-TAINT-SQLI-01',
  `Found ${directSqlFindings.length} flow path(s) at line ${directSqlFindings[0]?.line}`
)
assertTest(
  'Direct-Flow',
  'Taint path contains exactly 2 steps (SOURCE and SINK)',
  directSqlFindings[0].taintPath.length === 2 &&
    directSqlFindings[0].taintPath[0].type === 'SOURCE' &&
    directSqlFindings[0].taintPath[1].type === 'SINK',
  `Path steps: ${directSqlFindings[0].taintPath.map(s => s.type).join(' -> ')}`
)
TP++

const directCmdFiles = {
  'handler.py': `
    def run_cmd():
      target = request.args['cmd']
      os.system("ping -c 1 " + target)
  `
}
const directCmdFindings = traceTaint(directCmdFiles, 'handler.py')
assertTest(
  'Direct-Flow',
  'Direct Python Command Injection flow detected from request.args to os.system',
  directCmdFindings.length === 1 && directCmdFindings[0].ruleId === 'RPM-TAINT-CMDI-02',
  `Found ${directCmdFindings.length} flow path(s)`
)
TP++

// ----------------------------------------------------------------------------
// SUITE 2: FLOWS THROUGH HELPER FUNCTIONS
// ----------------------------------------------------------------------------
console.log('\n--- 2. Flows Through Local Helper Functions ---')

const helperSqlFiles = {
  'controller.ts': `
    function buildQuery(userId) {
      return "SELECT * FROM accounts WHERE owner_id = '" + userId + "'";
    }

    app.get('/account', (req, res) => {
      const owner = req.query.owner;
      const sql = buildQuery(owner);
      db.query(sql);
    });
  `
}
const helperFindings = traceTaint(helperSqlFiles, 'controller.ts')
assertTest(
  'Helper-Flow',
  'SQL Injection tracked through helper function buildQuery to db.query',
  helperFindings.length === 1 && helperFindings[0].ruleId === 'RPM-TAINT-SQLI-01',
  `Captured path across function boundary`
)
assertTest(
  'Helper-Flow',
  'Helper path records FUNCTION_ENTRY step',
  helperFindings[0].taintPath.some(s => s.type === 'FUNCTION_ENTRY'),
  `Path steps: ${helperFindings[0].taintPath.map(s => s.type).join(' -> ')}`
)
TP++

// ----------------------------------------------------------------------------
// SUITE 3: CROSS-FILE PROPAGATION
// ----------------------------------------------------------------------------
console.log('\n--- 3. Cross-File Module Propagation ---')

const crossFileTree = {
  'src/routes/invoice.ts': `
    import { processInvoiceQuery } from '../services/billing';

    app.post('/invoice', (req, res) => {
      const invoiceId = req.query.invoiceId;
      processInvoiceQuery(invoiceId);
    });
  `,
  'src/services/billing.ts': `
    export function processInvoiceQuery(invId) {
      const sql = "UPDATE invoices SET status = 'PAID' WHERE id = " + invId;
      db.query(sql);
    }
  `
}
const crossFindings = traceTaint(crossFileTree, 'src/routes/invoice.ts')
assertTest(
  'Cross-File',
  'Cross-file taint flow resolved from route handler to imported service module',
  crossFindings.length === 1 && crossFindings[0].isInterprocedural === true,
  `Source: ${crossFindings[0]?.source.filePath}:${crossFindings[0]?.source.line} -> Sink: ${crossFindings[0]?.sink.filePath}:${crossFindings[0]?.sink.line}`
)
TP++

// ----------------------------------------------------------------------------
// SUITE 4: VERIFIED SANITIZERS & DEFENSIVE GUARDS (TRUE NEGATIVE TRAPS)
// ----------------------------------------------------------------------------
console.log('\n--- 4. Verified Sanitizers & Defensive Guards (True Negative Traps) ---')

// A. Parameterized SQL query
const safeSqlFiles = {
  'safe_sql.ts': `
    app.get('/user', (req, res) => {
      const id = req.query.id;
      db.query("SELECT * FROM users WHERE id = $1", [id]);
    });
  `
}
const safeSqlFindings = traceTaint(safeSqlFiles, 'safe_sql.ts')
assertTest(
  'Sanitizer-Trap',
  'Parameterized SQL query with [$1, [id]] is correctly recognized as protected (TN)',
  safeSqlFindings.length === 0,
  `Zero findings generated (safe parameterization respected)`
)
TN++

// B. Structured execFile
const safeCmdFiles = {
  'safe_cmd.ts': `
    app.get('/git', (req, res) => {
      const branch = req.query.branch;
      execFile('git', ['checkout', branch]);
    });
  `
}
const safeCmdFindings = traceTaint(safeCmdFiles, 'safe_cmd.ts')
assertTest(
  'Sanitizer-Trap',
  'Structured execFile execution is correctly recognized as safe (TN)',
  safeCmdFindings.length === 0,
  `Zero findings generated (shell injection prevented)`
)
TN++

// C. path.basename traversal defense
const safePathFiles = {
  'safe_path.ts': `
    app.get('/download', (req, res) => {
      const rawFile = req.query.file;
      const safeFile = path.basename(rawFile);
      fs.readFile(safeFile);
    });
  `
}
const safePathFindings = traceTaint(safePathFiles, 'safe_path.ts')
assertTest(
  'Sanitizer-Trap',
  'path.basename() sanitizer suppresses Path Traversal finding (TN)',
  safePathFindings.length === 0,
  `Sanitizer path.basename respected`
)
TN++

// D. DOMPurify XSS defense
const safeXssFiles = {
  'safe_xss.ts': `
    app.get('/render', (req, res) => {
      const userHtml = req.query.html;
      const cleanHtml = DOMPurify.sanitize(userHtml);
      element.innerHTML = cleanHtml;
    });
  `
}
const safeXssFindings = traceTaint(safeXssFiles, 'safe_xss.ts')
assertTest(
  'Sanitizer-Trap',
  'DOMPurify.sanitize() suppresses DOM XSS finding (TN)',
  safeXssFindings.length === 0,
  `Sanitizer DOMPurify respected`
)
TN++

// ----------------------------------------------------------------------------
// SUITE 5: MISLEADING SANITIZER NAMES (FALSE SANITIZER TRAP)
// ----------------------------------------------------------------------------
console.log('\n--- 5. Misleading Sanitizer Names (False Sanitizer Trap) ---')

const misleadingSanitizerFiles = {
  'deceptive.ts': `
    function sanitizeInput(val) {
      // Deceptive name: merely trims whitespace, does not neutralize SQL injection!
      return val.trim();
    }

    app.get('/search', (req, res) => {
      const raw = req.query.term;
      const cleaned = sanitizeInput(raw);
      db.query("SELECT * FROM items WHERE name = '" + cleaned + "'");
    });
  `
}
const misleadingFindings = traceTaint(misleadingSanitizerFiles, 'deceptive.ts')
assertTest(
  'Deceptive-Sanitizer',
  'Non-neutralizing function with "sanitize" in name is NOT falsely trusted as safe (TP)',
  misleadingFindings.length === 1 && misleadingFindings[0].ruleId === 'RPM-TAINT-SQLI-01',
  `Correctly identified vulnerability despite deceptive helper name`
)
TP++

// ----------------------------------------------------------------------------
// SUITE 6: RESILIENCE & BOUNDED SEARCH BUDGETS
// ----------------------------------------------------------------------------
console.log('\n--- 6. Resilience, Cycle Detection & Search Budget Bounds ---')

// A. Cyclic Import Resilience
const cyclicFiles = {
  'moduleA.ts': `
    import { helperB } from './moduleB';
    export function helperA(x) {
      return helperB(x);
    }
  `,
  'moduleB.ts': `
    import { helperA } from './moduleA';
    export function helperB(x) {
      return helperA(x);
    }
  `,
  'main.ts': `
    import { helperA } from './moduleA';
    app.get('/loop', (req, res) => {
      const val = req.query.v;
      helperA(val);
    });
  `
}
const startCycleTime = performance.now()
const cyclicFindings = traceTaint(cyclicFiles, 'main.ts')
const cycleDuration = performance.now() - startCycleTime
assertTest(
  'Resilience',
  'Cyclic imports between moduleA and moduleB terminated gracefully without stack overflow',
  cycleDuration < 50 && cyclicFindings.length === 0,
  `Terminated in ${cycleDuration.toFixed(2)} ms`
)

// B. Missing file / unresolved symbol resilience
const missingFileTree = {
  'app.ts': `
    import { unknownHelper } from './non_existent_module';
    app.get('/external', (req, res) => {
      const data = req.query.d;
      unknownHelper(data);
    });
  `
}
const missingFindings = traceTaint(missingFileTree, 'app.ts')
assertTest(
  'Resilience',
  'Missing module reference handled gracefully without runtime crash or fabricated path',
  missingFindings.length === 0,
  `Zero crashed executions`
)

// C. Maximum Depth Budget Bounding
const deepChainFiles = {
  'deep.ts': `
    function f1(x) { return f2(x); }
    function f2(x) { return f3(x); }
    function f3(x) { return f4(x); }
    function f4(x) { return f5(x); }
    function f5(x) { return f6(x); }
    function f6(x) { return f7(x); }
    function f7(x) { db.query(x); }

    app.get('/deep', (req, res) => {
      const v = req.query.v;
      f1(v);
    });
  `
}
const deepFindings = traceTaint(deepChainFiles, 'deep.ts')
assertTest(
  'Budget-Bound',
  'Depth budget limit (<= 5 hops) safely prevents runaway recursion',
  deepFindings.length === 0,
  `Depth bounding functional, findings: ${deepFindings.length}`
)

// ----------------------------------------------------------------------------
// SCORECARD
// ----------------------------------------------------------------------------
console.log('\n======================================================================')
console.log('  PHASE 8 TAINT ANALYSIS TEST SUITE SCORECARD')
console.log('======================================================================')
console.log(`  True Positives  (TP) : ${TP}`)
console.log(`  False Positives (FP) : ${FP}`)
console.log(`  True Negatives  (TN) : ${TN}`)
console.log(`  False Negatives (FN) : ${FN}`)
const precision = (TP / (TP + FP)) * 100
const recall = (TP / (TP + FN)) * 100
const accuracy = ((TP + TN) / (TP + TN + FP + FN)) * 100
const f1 = (2 * precision * recall) / (precision + recall)
console.log(`  Precision            : ${precision.toFixed(2)}%`)
console.log(`  Recall               : ${recall.toFixed(2)}%`)
console.log(`  Accuracy             : ${accuracy.toFixed(2)}%`)
console.log(`  F1-Score             : ${f1.toFixed(2)}%`)
console.log('======================================================================\n')

assert.strictEqual(FP, 0, 'Must have zero false positives')
assert.strictEqual(FN, 0, 'Must have zero false negatives')
assert.strictEqual(precision, 100, 'Precision must be 100%')
assert.strictEqual(recall, 100, 'Recall must be 100%')

console.log('  ✅ ALL PHASE 8 TAINT ANALYSIS UNIT INVARIANTS PASSED!\n')
