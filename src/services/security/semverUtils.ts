// src/services/security/semverUtils.ts
// Robust, pure SemVer 2.0.0 parsing, comparison, and range evaluation without external dependencies

export interface ParsedSemver {
  major: number
  minor: number
  patch: number
  prerelease: (string | number)[]
  build: string[]
  raw: string
}

/**
 * Parses a semver string into major, minor, patch, prerelease, and build components.
 */
export function parseSemver(v: string): ParsedSemver | null {
  if (!v || typeof v !== 'string') return null
  const clean = v.trim().replace(/^[v=~^><\s]+/, '').replace(/^==\s*/, '')
  if (!clean) return null

  // Split build metadata
  const [withoutBuild, ...buildParts] = clean.split('+')
  const build = buildParts.length > 0 ? buildParts.join('+').split('.') : []

  // Split prerelease
  const [corePart, ...preParts] = withoutBuild.split('-')
  let prerelease: (string | number)[] = []
  if (preParts.length > 0) {
    const preStr = preParts.join('-')
    if (!preStr) return null
    const rawIds = preStr.split('.')
    for (const id of rawIds) {
      if (/^\d+$/.test(id)) {
        if (id.length > 1 && id.startsWith('0')) {
          return null // SemVer 2.0.0 §9: Numeric identifiers MUST NOT include leading zeroes
        }
        prerelease.push(parseInt(id, 10))
      } else {
        if (!/^[a-zA-Z0-9-]+$/.test(id)) {
          return null
        }
        prerelease.push(id)
      }
    }
  }

  // Core version parts
  const coreSegments = corePart.split('.')
  if (coreSegments.length === 0 || coreSegments.length > 3) {
    return null
  }

  // Check if the final segment has embedded PEP 440 prerelease syntax, e.g. "0a1", "2rc1", "1b2"
  const pepMatch = coreSegments[coreSegments.length - 1].match(/^(\d+)([a-zA-Z]+)(\d*)$/)
  if (pepMatch) {
    coreSegments[coreSegments.length - 1] = pepMatch[1]
    const tag = pepMatch[2].toLowerCase()
    const tagNum = pepMatch[3] ? parseInt(pepMatch[3], 10) : 0
    if (prerelease.length === 0) {
      prerelease = [tag, tagNum]
    }
  }

  // Strictly validate that all core segments are pure digits without leading zeroes (SemVer 2.0.0 §2)
  for (const seg of coreSegments) {
    if (!/^\d+$/.test(seg)) {
      return null
    }
    if (seg.length > 1 && seg.startsWith('0')) {
      return null
    }
  }

  const major = parseInt(coreSegments[0] || '0', 10)
  const minor = parseInt(coreSegments[1] || '0', 10)
  const patch = parseInt(coreSegments[2] || '0', 10)

  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    return null
  }

  return { major, minor, patch, prerelease, build, raw: v.trim() }
}

/**
 * Compares two semver strings.
 * Returns:
 *   < 0 if v1 < v2
 *   > 0 if v1 > v2
 *   0 if v1 === v2
 */
export function compareSemver(v1: string, v2: string): number {
  const p1 = parseSemver(v1)
  const p2 = parseSemver(v2)

  if (!p1 && !p2) return 0
  if (!p1) return -1
  if (!p2) return 1

  // Compare major, minor, patch
  if (p1.major !== p2.major) return p1.major - p2.major
  if (p1.minor !== p2.minor) return p1.minor - p2.minor
  if (p1.patch !== p2.patch) return p1.patch - p2.patch

  // Normal version has higher precedence than prerelease
  if (p1.prerelease.length === 0 && p2.prerelease.length > 0) return 1
  if (p1.prerelease.length > 0 && p2.prerelease.length === 0) return -1
  if (p1.prerelease.length === 0 && p2.prerelease.length === 0) return 0

  // Compare prerelease identifiers per SemVer 2.0 spec
  const maxLen = Math.max(p1.prerelease.length, p2.prerelease.length)
  for (let i = 0; i < maxLen; i++) {
    const id1 = p1.prerelease[i]
    const id2 = p2.prerelease[i]

    if (id1 === undefined) return -1
    if (id2 === undefined) return 1

    const isNum1 = typeof id1 === 'number'
    const isNum2 = typeof id2 === 'number'

    if (isNum1 && isNum2) {
      if (id1 !== id2) return (id1 as number) - (id2 as number)
    } else if (!isNum1 && !isNum2) {
      if (id1 !== id2) return String(id1).localeCompare(String(id2))
    } else {
      // Numeric identifiers always have lower precedence than non-numeric identifiers
      return isNum1 ? -1 : 1
    }
  }

  return 0
}

/**
 * Checks whether a version string denotes an exact pinned version.
 */
export function isExactVersion(versionStr: string): boolean {
  if (!versionStr) return false
  const trimmed = versionStr.trim()
  if (
    trimmed.startsWith('^') ||
    trimmed.startsWith('~') ||
    trimmed.startsWith('>') ||
    trimmed.startsWith('<') ||
    trimmed.startsWith('*') ||
    trimmed.includes('||') ||
    trimmed.includes(' - ') ||
    trimmed.includes('x') ||
    trimmed.includes('X') ||
    trimmed.startsWith('git') ||
    trimmed.startsWith('http') ||
    trimmed.startsWith('file:') ||
    trimmed.startsWith('link:') ||
    trimmed.startsWith('workspace:') ||
    trimmed.includes('${')
  ) {
    return false
  }
  return parseSemver(trimmed) !== null
}

/**
 * Evaluates whether a candidate version satisfies an affected or required range.
 * Supports:
 * - Single comparators: '< 1.2.0', '<= 2.1.0', '> 1.0.0', '>= 1.0.0', '= 1.0.0', '== 1.0.0'
 * - Caret ranges: '^1.2.3', '^0.2.3', '^0.0.4'
 * - Tilde ranges: '~1.2.3', '~1.2'
 * - Hyphen ranges: '1.2.0 - 2.3.0'
 * - Compound intersections: '>= 1.2.0 < 2.0.0'
 * - Unions: '< 1.2.0 || >= 2.0.0'
 */
export function satisfiesRange(version: string, rangeStr: string): boolean {
  if (!version || !rangeStr) return false
  const cleanRange = rangeStr.trim()
  if (cleanRange === '*' || cleanRange === 'all') return true

  // Handle union: A || B
  if (cleanRange.includes('||')) {
    const clauses = cleanRange.split('||').map((c) => c.trim())
    return clauses.some((clause) => satisfiesRange(version, clause))
  }

  // Handle hyphen ranges: 1.0.0 - 2.0.0, 1.2 - 2.3.4, 1.2.3 - 2
  const hyphenMatch = cleanRange.match(/^([^\s]+)\s+-\s+([^\s]+)$/)
  if (hyphenMatch) {
    const lower = hyphenMatch[1]
    const upper = hyphenMatch[2]
    const upperSegs = upper.split('.')
    if (upperSegs.length === 1 && /^\d+$/.test(upperSegs[0])) {
      return satisfiesRange(version, `>= ${lower} < ${parseInt(upperSegs[0], 10) + 1}.0.0`)
    } else if (upperSegs.length === 2 && /^\d+$/.test(upperSegs[0]) && /^\d+$/.test(upperSegs[1])) {
      return satisfiesRange(version, `>= ${lower} < ${upperSegs[0]}.${parseInt(upperSegs[1], 10) + 1}.0`)
    } else {
      return satisfiesRange(version, `>= ${lower} <= ${upper}`)
    }
  }

  // Normalize spaces after comparator operators: e.g. "< 1.2.0" -> "<1.2.0"
  const normalizedRange = cleanRange.replace(/([><=~^]+)\s+/g, '$1')

  // Tokenize compound clause by spaces
  const tokens = normalizedRange.split(/\s+/).filter(Boolean)
  for (const token of tokens) {
    if (!checkSingleConstraint(version, token)) {
      return false
    }
  }

  return true
}

function checkSingleConstraint(version: string, constraint: string): boolean {
  const c = constraint.trim()
  if (!c || c === '*' || c.toLowerCase() === 'all') return true

  const pVer = parseSemver(version)
  if (!pVer) return false

  // Wildcard and X-ranges: 1.x, 1.X, 1.*, 1.2.x, 1.2.*, 0.x
  const wildcardMatch = c.match(/^(\d+)(?:\.(\d+))?\.[xX*]$/)
  if (wildcardMatch) {
    const major = parseInt(wildcardMatch[1], 10)
    if (wildcardMatch[2] !== undefined) {
      const minor = parseInt(wildcardMatch[2], 10)
      return satisfiesRange(version, `>= ${major}.${minor}.0 < ${major}.${minor + 1}.0`)
    } else {
      return satisfiesRange(version, `>= ${major}.0.0 < ${major + 1}.0.0`)
    }
  }
  if (/^[xX*]$/.test(c)) {
    return true
  }

  // Caret ranges (^1.2.3, ^0.2.3, ^0.0.4)
  if (c.startsWith('^')) {
    const base = c.slice(1).trim()
    const pBase = parseSemver(base)
    if (!pBase) return false

    // A prerelease version cannot satisfy a caret range unless the base has a prerelease on the same tuple
    if (pVer.prerelease.length > 0) {
      if (pBase.prerelease.length === 0) return false
      if (pVer.major !== pBase.major || pVer.minor !== pBase.minor || pVer.patch !== pBase.patch) return false
    }

    if (pBase.major > 0) {
      return satisfiesRange(version, `>= ${base} < ${pBase.major + 1}.0.0`)
    } else if (pBase.minor > 0) {
      return satisfiesRange(version, `>= ${base} < 0.${pBase.minor + 1}.0`)
    } else {
      return satisfiesRange(version, `>= ${base} < 0.0.${pBase.patch + 1}`)
    }
  }

  // Tilde ranges (~1.2.3, ~1.2)
  if (c.startsWith('~')) {
    const base = c.slice(1).trim()
    const pBase = parseSemver(base)
    if (!pBase) return false

    if (pVer.prerelease.length > 0) {
      if (pBase.prerelease.length === 0) return false
      if (pVer.major !== pBase.major || pVer.minor !== pBase.minor || pVer.patch !== pBase.patch) return false
    }

    return satisfiesRange(version, `>= ${base} < ${pBase.major}.${pBase.minor + 1}.0`)
  }

  // Comparators: <=, >=, <, >, ==, =
  if (c.startsWith('<=')) {
    const target = c.slice(2).trim()
    return compareSemver(version, target) <= 0
  }
  if (c.startsWith('>=')) {
    const target = c.slice(2).trim()
    return compareSemver(version, target) >= 0
  }
  if (c.startsWith('<')) {
    const target = c.slice(1).trim()
    const pTarget = parseSemver(target)
    if (pTarget && pVer.prerelease.length > 0 && pTarget.prerelease.length === 0) {
      // If version is a prerelease of the upper bound tuple (e.g. 2.0.0-alpha vs 2.0.0),
      // it belongs to the target release series and is excluded by < target
      if (pVer.major === pTarget.major && pVer.minor === pTarget.minor && pVer.patch === pTarget.patch) {
        return false
      }
    }
    return compareSemver(version, target) < 0
  }
  if (c.startsWith('>')) {
    const target = c.slice(1).trim()
    return compareSemver(version, target) > 0
  }
  if (c.startsWith('==')) {
    const target = c.slice(2).trim()
    return compareSemver(version, target) === 0
  }
  if (c.startsWith('=')) {
    const target = c.slice(1).trim()
    return compareSemver(version, target) === 0
  }

  // Exact version match
  return compareSemver(version, c) === 0
}

// Re-export standards-grounded PEP 440 utilities
export { parsePep440, comparePep440, isPep440ExactVersion, satisfiesPep440Range } from './pep440Utils'

