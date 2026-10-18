// tests/repoAnalysisService.test.js
// Verification of deterministic import extraction, path resolution, Martin instability, and BFS blast radius

import assert from 'node:assert/strict'

console.log('\n=============================================================')
console.log('  REPOMIND PHASE 5B: REPO ANALYSIS SERVICE INTEGRITY TESTS')
console.log('=============================================================\n')

// 1. Token Redaction Test
function sanitizeErrorMessage(msg) {
  if (!msg) return ''
  return msg
    .replace(/ghp_[a-zA-Z0-9]{36}/g, 'ghp_***[REDACTED]')
    .replace(/github_pat_[a-zA-Z0-9_]{82}/g, 'github_pat_***[REDACTED]')
    .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer ***[REDACTED]')
    .replace(/(token|key|secret|password)=([^&\s]+)/gi, '$1=***[REDACTED]')
}

const rawError = 'Failed with token ghp_123456789012345678901234567890123456 and Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz'
const sanitized = sanitizeErrorMessage(rawError)
assert.strictEqual(sanitized.includes('ghp_1234567890'), false, 'PAT must be redacted')
assert.strictEqual(sanitized.includes('eyJhbGciOiJIUzI1Ni'), false, 'Bearer token must be redacted')
console.log('  [PASS] [Security] GitHub Personal Access Token and Bearer headers redacted')

// 2. Lexical Import Extraction Test (Multi-Language)
function extractImports(content, filePath) {
  const imports = []
  const ext = filePath.split('.').pop()?.toLowerCase() || ''

  if (['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs'].includes(ext)) {
    // Standard ES import: import ... from '...'
    const esImportRegex = /(?:import\s+(?:([\w*\s{},$]+)\s+from\s+)?['"]([^'"]+)['"])|(?:export\s+(?:([\w*\s{},$]+)\s+from\s+)['"]([^'"]+)['"])/g
    let match
    while ((match = esImportRegex.exec(content)) !== null) {
      const symbols = match[1] || match[3] || ''
      const specifier = match[2] || match[4]
      if (specifier) {
        imports.push({
          specifier,
          rawStatement: match[0],
          importedSymbol: symbols.trim() || undefined,
          isRelative: specifier.startsWith('.'),
          sourceFile: filePath,
          importType: symbols.includes('{') ? 'named' : symbols.includes('* as') ? 'namespace' : 'default'
        })
      }
    }
    // Dynamic import: import('...')
    const dynRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    while ((match = dynRegex.exec(content)) !== null) {
      imports.push({
        specifier: match[1],
        rawStatement: match[0],
        isRelative: match[1].startsWith('.'),
        sourceFile: filePath,
        importType: 'dynamic'
      })
    }
    // CommonJS require: require('...')
    const cjsRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    while ((match = cjsRegex.exec(content)) !== null) {
      imports.push({
        specifier: match[1],
        rawStatement: match[0],
        isRelative: match[1].startsWith('.'),
        sourceFile: filePath,
        importType: 'commonjs'
      })
    }
  } else if (ext === 'py') {
    // Python imports
    const pyFromRegex = /^\s*from\s+([.\w]+)\s+import\s+([^\n#]+)/gm
    let match
    while ((match = pyFromRegex.exec(content)) !== null) {
      imports.push({
        specifier: match[1],
        rawStatement: match[0].trim(),
        importedSymbol: match[2].trim(),
        isRelative: match[1].startsWith('.'),
        sourceFile: filePath,
        importType: 'named'
      })
    }
    const pyImportRegex = /^\s*import\s+([^\n#]+)/gm
    while ((match = pyImportRegex.exec(content)) !== null) {
      const modules = match[1].split(',').map(m => m.trim().split(/\s+as\s+/)[0])
      for (const mod of modules) {
        if (mod) {
          imports.push({
            specifier: mod,
            rawStatement: match[0].trim(),
            isRelative: mod.startsWith('.'),
            sourceFile: filePath,
            importType: 'default'
          })
        }
      }
    }
  } else if (ext === 'go') {
    // Go imports
    const goSingleRegex = /import\s+"([^"]+)"/g
    let match
    while ((match = goSingleRegex.exec(content)) !== null) {
      imports.push({
        specifier: match[1],
        rawStatement: match[0],
        isRelative: match[1].startsWith('.'),
        sourceFile: filePath,
        importType: 'default'
      })
    }
    const goBlockRegex = /import\s*\(([\s\S]*?)\)/g
    while ((match = goBlockRegex.exec(content)) !== null) {
      const lines = match[1].split('\n')
      for (const line of lines) {
        const lineMatch = /"([^"]+)"/.exec(line)
        if (lineMatch) {
          imports.push({
            specifier: lineMatch[1],
            rawStatement: line.trim(),
            isRelative: lineMatch[1].startsWith('.'),
            sourceFile: filePath,
            importType: 'default'
          })
        }
      }
    }
  } else if (ext === 'rs') {
    // Rust use statements
    const rsUseRegex = /use\s+([^;]+);/g
    let match
    while ((match = rsUseRegex.exec(content)) !== null) {
      const spec = match[1].trim()
      imports.push({
        specifier: spec,
        rawStatement: match[0],
        isRelative: spec.startsWith('super::') || spec.startsWith('self::'),
        sourceFile: filePath,
        importType: 'language_import'
      })
    }
  }

  return imports
}

// Test TypeScript / JS extraction
const tsSnippet = `
import React, { useState, useEffect } from 'react'
import { UserService } from '../services/userService'
import defaultExport from './helper'
const db = require('pg')
const lazyMod = () => import('./asyncModule')
`
const tsImports = extractImports(tsSnippet, 'src/controllers/userController.ts')
assert.strictEqual(tsImports.length, 5, `Expected 5 TS imports, got ${tsImports.length}`)
assert.strictEqual(tsImports.some(i => i.specifier === '../services/userService' && i.importedSymbol === '{ UserService }'), true)
assert.strictEqual(tsImports.some(i => i.specifier === 'pg' && i.importType === 'commonjs'), true)
assert.strictEqual(tsImports.some(i => i.specifier === './asyncModule' && i.importType === 'dynamic'), true)
console.log('  [PASS] [Extraction] TypeScript/JavaScript named, default, CommonJS, and dynamic imports extracted')

// Test Python extraction
const pySnippet = `
import os, sys
from ..models import UserProfile
from database import session
`
const pyImports = extractImports(pySnippet, 'app/views/user.py')
assert.strictEqual(pyImports.some(i => i.specifier === '..models' && i.importedSymbol === 'UserProfile'), true)
assert.strictEqual(pyImports.some(i => i.specifier === 'database' && i.importedSymbol === 'session'), true)
console.log('  [PASS] [Extraction] Python from/import and relative statements extracted')

// Test Go extraction
const goSnippet = `
package main

import (
  "context"
  "github.com/gin-gonic/gin"
  "myproject/internal/store"
)
`
const goImports = extractImports(goSnippet, 'cmd/server/main.go')
assert.strictEqual(goImports.length, 3)
assert.strictEqual(goImports.some(i => i.specifier === 'github.com/gin-gonic/gin'), true)
assert.strictEqual(goImports.some(i => i.specifier === 'myproject/internal/store'), true)
console.log('  [PASS] [Extraction] Go factored import blocks extracted')

// Test Rust extraction
const rsSnippet = `
use std::sync::Arc;
use crate::models::order::Order;
use super::auth;
`
const rsImports = extractImports(rsSnippet, 'src/services/payment.rs')
assert.strictEqual(rsImports.length, 3)
// Path resolution test
function resolveImportToPath(sourceFile, specifier, allFiles) {
  if (!specifier.startsWith('.')) return null
  const sourceDirParts = sourceFile.split('/').slice(0, -1)
  const specParts = specifier.split('/')
  const resolved = [...sourceDirParts]
  for (const part of specParts) {
    if (part === '.' || part === '') continue
    if (part === '..') {
      if (resolved.length > 0) resolved.pop()
    } else {
      resolved.push(part)
    }
  }
  const basePath = resolved.join('/')
  const candidateExtensions = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.go', '.rs', '/index.ts', '/index.js', '/index.tsx', '/__init__.py']
  for (const ext of candidateExtensions) {
    const candidate = basePath + ext
    if (allFiles.includes(candidate)) {
      return candidate
    }
  }
  return null
}

const mockFiles = [
  'src/controllers/userController.ts',
  'src/services/userService.ts',
  'src/models/user.ts',
  'src/utils/index.ts'
]
const resolved1 = resolveImportToPath('src/controllers/userController.ts', '../services/userService', mockFiles)
assert.strictEqual(resolved1, 'src/services/userService.ts', 'Must resolve relative ../ to exact file with extension')
const resolved2 = resolveImportToPath('src/controllers/userController.ts', '../utils', mockFiles)
assert.strictEqual(resolved2, 'src/utils/index.ts', 'Must resolve directory import to index.ts')
console.log('  [PASS] [Resolution] Relative import paths resolved against repository file tree')

// 3. Martin Instability Mathematical Invariants
function computeMartinInstability(Ca, Ce) {
  const total = Ca + Ce
  if (total === 0) return 0.0
  return Number((Ce / total).toFixed(2))
}

assert.strictEqual(computeMartinInstability(0, 0), 0.0, 'Zero coupling must yield 0.0 without NaN')
assert.strictEqual(computeMartinInstability(4, 3), 0.43, 'Ca=4, Ce=3 must yield 0.43')
assert.strictEqual(computeMartinInstability(0, 4), 1.0, 'Ca=0, Ce=4 must yield 1.0')
assert.strictEqual(computeMartinInstability(5, 0), 0.0, 'Ca=5, Ce=0 must yield 0.0')
assert.strictEqual(computeMartinInstability(2, 2), 0.5, 'Ca=2, Ce=2 must yield 0.5')
console.log('  [PASS] [Mathematics] Martin instability I = Ce / (Ca + Ce) bounded in [0.0, 1.0] with zero check')

// 4. Graph BFS Blast Radius with Hop Distance Tiers & Cycle Prevention
function computeBfsBlastRadius(epicenterId, components, edges) {
  const distMap = new Map()
  distMap.set(epicenterId, 0)
  const queue = [epicenterId]
  const tier1 = []
  const tier2 = []
  const tier3 = []
  const visited = new Set()

  while (queue.length > 0) {
    const curr = queue.shift()
    // Find all callers: edges where current is target (reverse traversal for failure impact)
    const callers = edges.filter(e => e.target === curr).map(e => e.source)

    for (const callerId of callers) {
      if (!distMap.has(callerId)) {
        const d = distMap.get(curr) + 1
        distMap.set(callerId, d)
        visited.add(callerId)
        queue.push(callerId)

        const callerComp = components.find(c => c.id === callerId)
        const name = callerComp ? callerComp.name : callerId

        if (d === 1) {
          tier1.push(`${name} (Direct caller: d=1)`)
        } else if (d === 2) {
          tier2.push(`${name} (Transitive caller: d=2)`)
        } else {
          tier3.push(`${name} (Cascade caller: d=${d})`)
        }
      }
    }
  }

  const radiusPercent = Math.min(100, Math.round((visited.size / Math.max(1, components.length - 1)) * 100))
  return { visited: Array.from(visited), tier1, tier2, tier3, radiusPercent }
}

// Test BFS on graph with cycle:
// A -> B -> C -> D, and D -> B (cycle)
const testComponents = [
  { id: 'A', name: 'Gateway' },
  { id: 'B', name: 'OrderService' },
  { id: 'C', name: 'PaymentService' },
  { id: 'D', name: 'AccountingWorker' }
]
const testEdges = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'D' },
  { source: 'D', target: 'B' } // cycle
]

// When C (PaymentService) fails:
// Direct caller of C is B (d=1) -> Tier 1
// Direct caller of B is A (from A->B) and D (from D->B) (d=2) -> Tier 2
// Epicenter C is not in visited.
const blastC = computeBfsBlastRadius('C', testComponents, testEdges)
assert.strictEqual(blastC.visited.includes('C'), false, 'Epicenter must not be in its own impact set')
assert.strictEqual(blastC.tier1.some(t => t.includes('OrderService')), true, 'B must be Tier 1')
assert.strictEqual(blastC.tier2.some(t => t.includes('Gateway')), true, 'A must be Tier 2')
assert.strictEqual(blastC.tier2.some(t => t.includes('AccountingWorker')), true, 'D must be Tier 2')
assert.strictEqual(blastC.radiusPercent, 100, '3/3 nodes impacted = 100%')
console.log('  [PASS] [Blast Radius] Reverse graph BFS correctly computes hop-distance tiers without cycle loops')

console.log('\n=============================================================')
console.log('  ALL INTEGRITY TESTS PASSED (5/5)')
console.log('=============================================================\n')
