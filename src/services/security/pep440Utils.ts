// src/services/security/pep440Utils.ts
// Standards-grounded Python PEP 440 version parsing, precedence comparison, and range evaluation.
// Implements PEP 440 specifications: epochs, release segments, pre-releases, post-releases, dev-releases,
// compatible release (~=), prefix matching (== *), and local versions.

export interface ParsedPep440 {
  epoch: number
  release: number[]
  pre: { type: 'a' | 'b' | 'rc'; num: number } | null
  post: number | null
  dev: number | null
  local: string | null
  raw: string
}

const PEP440_REGEX = /^([0-9]+!)?([0-9]+(?:\.[0-9]+)*)(?:[-._]?(a|b|rc|alpha|beta|c|preview)[-._]?([0-9]*))?(?:[-._]?(post)[-._]?([0-9]*))?(?:[-._]?(dev)[-._]?([0-9]*))?(?:\+([a-zA-Z0-9._-]+))?$/i

/**
 * Parses a Python version string according to PEP 440 specification.
 */
export function parsePep440(v: string): ParsedPep440 | null {
  if (!v || typeof v !== 'string') return null
  const clean = v.trim().replace(/^==\s*/, '').replace(/^[=~^><\s]+/, '')
  if (!clean) return null

  const match = clean.match(PEP440_REGEX)
  if (!match) return null

  const epoch = match[1] ? parseInt(match[1].slice(0, -1), 10) : 0
  const release = match[2].split('.').map((n) => parseInt(n, 10))

  let pre: { type: 'a' | 'b' | 'rc'; num: number } | null = null
  if (match[3]) {
    let tag = match[3].toLowerCase()
    if (tag === 'alpha') tag = 'a'
    else if (tag === 'beta') tag = 'b'
    else if (tag === 'c' || tag === 'preview') tag = 'rc'
    const num = match[4] ? parseInt(match[4], 10) : 0
    pre = { type: tag as 'a' | 'b' | 'rc', num }
  }

  const post = match[5] ? (match[6] ? parseInt(match[6], 10) : 0) : null
  const dev = match[7] ? (match[8] ? parseInt(match[8], 10) : 0) : null
  const local = match[9] || null

  return { epoch, release, pre, post, dev, local, raw: v.trim() }
}

/**
 * Compares two PEP 440 version strings per specification ordering.
 * Returns: < 0 if v1 < v2, > 0 if v1 > v2, 0 if v1 === v2
 */
export function comparePep440(v1: string, v2: string): number {
  const p1 = parsePep440(v1)
  const p2 = parsePep440(v2)

  if (!p1 && !p2) return 0
  if (!p1) return -1
  if (!p2) return 1

  // 1. Compare epoch
  if (p1.epoch !== p2.epoch) {
    return p1.epoch - p2.epoch
  }

  // 2. Compare release segments (PEP 440: 1.2.0 == 1.2)
  const maxRelLen = Math.max(p1.release.length, p2.release.length)
  for (let i = 0; i < maxRelLen; i++) {
    const r1 = p1.release[i] || 0
    const r2 = p2.release[i] || 0
    if (r1 !== r2) {
      return r1 - r2
    }
  }

  // 3. Compare pre-releases
  // Ordering: dev < a < b < rc < normal release < post
  const preOrder = (p: ParsedPep440) => {
    if (p.dev !== null && p.pre === null && p.post === null) return 0 // pure dev release on base
    if (p.pre) {
      if (p.pre.type === 'a') return 1
      if (p.pre.type === 'b') return 2
      if (p.pre.type === 'rc') return 3
    }
    return 4 // final release
  }

  const o1 = preOrder(p1)
  const o2 = preOrder(p2)
  if (o1 !== o2) return o1 - o2

  // If both have the same pre-release type, compare pre numbers
  if (p1.pre && p2.pre && p1.pre.type === p2.pre.type) {
    if (p1.pre.num !== p2.pre.num) {
      return p1.pre.num - p2.pre.num
    }
  }

  // 4. Compare post-releases: post-release is strictly newer than normal release
  const post1 = p1.post !== null ? p1.post : -1
  const post2 = p2.post !== null ? p2.post : -1
  if (post1 !== post2) {
    return post1 - post2
  }

  // 5. Compare dev-releases: dev-release is strictly older than normal release
  const dev1 = p1.dev !== null ? p1.dev : Infinity
  const dev2 = p2.dev !== null ? p2.dev : Infinity
  if (dev1 !== dev2) {
    return dev1 - dev2
  }

  // 6. Compare local versions if present
  if (p1.local && !p2.local) return 1
  if (!p1.local && p2.local) return -1
  if (p1.local && p2.local) {
    return p1.local.localeCompare(p2.local)
  }

  return 0
}

/**
 * Checks whether a Python version string denotes an exact pinned version.
 */
export function isPep440ExactVersion(versionStr: string): boolean {
  if (!versionStr) return false
  const trimmed = versionStr.trim()
  if (
    trimmed.startsWith('^') ||
    trimmed.startsWith('~') ||
    trimmed.startsWith('>') ||
    trimmed.startsWith('<') ||
    trimmed.startsWith('*') ||
    trimmed.includes('||') ||
    trimmed.includes(',') ||
    trimmed.includes(';') ||
    trimmed.startsWith('git') ||
    trimmed.startsWith('http')
  ) {
    return false
  }
  return parsePep440(trimmed) !== null
}

/**
 * Evaluates whether a candidate version satisfies a PEP 440 requirement specifier.
 * Supports:
 * - Compound constraints separated by commas: '>= 2.25.0, < 3.0.0'
 * - Compatible release: '~= 2.2.0', '~= 1.4'
 * - Wildcard prefix: '== 2.2.*', '!= 2.2.*'
 * - Standard comparators: '== 2.2.0', '>= 1.0', '<= 2.0', '< 2.0', '> 1.0', '!= 1.5.0'
 * - Arbitrary equality: '=== 2.2.0'
 */
export function satisfiesPep440Range(version: string, rangeStr: string): boolean {
  if (!version || !rangeStr) return false
  const cleanRange = rangeStr.trim()
  if (cleanRange === '*' || cleanRange === 'all') return true

  // Strip Python environment markers if present (e.g. "; python_version >= '3.8'")
  const [specWithoutMarkers] = cleanRange.split(';')
  const trimmedSpec = specWithoutMarkers.trim()

  // Tokenize by comma (PEP 440 clause separator)
  const clauses = trimmedSpec.split(',').map((c) => c.trim()).filter(Boolean)
  for (const clause of clauses) {
    if (!checkSinglePep440Constraint(version, clause)) {
      return false
    }
  }

  return true
}

function checkSinglePep440Constraint(version: string, constraint: string): boolean {
  const c = constraint.trim()
  if (!c || c === '*') return true

  const pVer = parsePep440(version)
  if (!pVer) return false

  // Compatible release: ~= X.Y.Z or ~= X.Y
  if (c.startsWith('~=')) {
    const base = c.slice(2).trim()
    const pBase = parsePep440(base)
    if (!pBase) return false

    // ~= X.Y.Z -> >= X.Y.Z, < X.(Y+1).0
    // ~= X.Y   -> >= X.Y, < (X+1).0
    if (comparePep440(version, base) < 0) {
      return false
    }

    if (pBase.release.length >= 3) {
      const upperRel = [...pBase.release]
      upperRel[upperRel.length - 2] += 1
      upperRel[upperRel.length - 1] = 0
      const upperStr = `${pBase.epoch ? pBase.epoch + '!' : ''}${upperRel.slice(0, -1).join('.')}.0`
      return comparePep440(version, upperStr) < 0
    } else if (pBase.release.length === 2) {
      const upperStr = `${pBase.epoch ? pBase.epoch + '!' : ''}${pBase.release[0] + 1}.0`
      return comparePep440(version, upperStr) < 0
    } else {
      const upperStr = `${pBase.epoch ? pBase.epoch + '!' : ''}${pBase.release[0] + 1}`
      return comparePep440(version, upperStr) < 0
    }
  }

  // Prefix wildcard match: == X.Y.* or != X.Y.*
  if (c.startsWith('==') && c.includes('*')) {
    const prefix = c.slice(2).replace('*', '').replace(/\.$/, '').trim()
    const pPrefix = parsePep440(prefix)
    if (!pPrefix) return false
    for (let i = 0; i < pPrefix.release.length; i++) {
      if (pVer.release[i] !== pPrefix.release[i]) return false
    }
    return true
  }

  if (c.startsWith('!=') && c.includes('*')) {
    const prefix = c.slice(2).replace('*', '').replace(/\.$/, '').trim()
    const pPrefix = parsePep440(prefix)
    if (!pPrefix) return true
    let matches = true
    for (let i = 0; i < pPrefix.release.length; i++) {
      if (pVer.release[i] !== pPrefix.release[i]) {
        matches = false
        break
      }
    }
    return !matches
  }

  // Arbitrary equality: === X.Y.Z
  if (c.startsWith('===')) {
    const target = c.slice(3).trim()
    return version.trim() === target
  }

  // Exact equality: == X.Y.Z
  if (c.startsWith('==')) {
    const target = c.slice(2).trim()
    return comparePep440(version, target) === 0
  }

  // Inequality: != X.Y.Z
  if (c.startsWith('!=')) {
    const target = c.slice(2).trim()
    return comparePep440(version, target) !== 0
  }

  // Comparison: <=
  if (c.startsWith('<=')) {
    const target = c.slice(2).trim()
    return comparePep440(version, target) <= 0
  }

  // Comparison: >=
  if (c.startsWith('>=')) {
    const target = c.slice(2).trim()
    return comparePep440(version, target) >= 0
  }

  // Comparison: <
  if (c.startsWith('<')) {
    const target = c.slice(1).trim()
    const pTarget = parsePep440(target)
    if (pTarget && pVer.pre && !pTarget.pre) {
      // Exclude pre-releases of the upper bound target
      const sameRel = pVer.release.every((r, idx) => r === (pTarget.release[idx] || 0))
      if (sameRel) return false
    }
    return comparePep440(version, target) < 0
  }

  // Comparison: >
  if (c.startsWith('>')) {
    const target = c.slice(1).trim()
    return comparePep440(version, target) > 0
  }

  // Direct version match
  return comparePep440(version, c) === 0
}
