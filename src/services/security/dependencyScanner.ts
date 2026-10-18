// src/services/security/dependencyScanner.ts
// Dependency vulnerability intelligence for RepoMind with multi-ecosystem lockfile-aware
// version resolution, advisory provider integration, and software supply-chain graph analysis.

import {
  DependencyPackage,
  SecurityFinding,
  DependencyScope,
  DependencyType,
  ResolutionMethod,
  ResolutionConfidence,
  LockfileAmbiguity
} from './types'
import { compareSemver, isExactVersion, satisfiesRange } from './semverUtils'
import {
  IAdvisoryProvider,
  VerifiedOfflineAdvisoryProvider,
  VERIFIED_CURATED_ADVISORIES,
  normalizePackageName,
  getCanonicalEcosystem
} from './advisoryProvider'
import { buildPurl } from './sbomGenerator'

// Re-export core SemVer utilities for backwards compatibility
export { compareSemver, isExactVersion, satisfiesRange }

// Backwards-compatible legacy advisory interface and export
export const VERIFIED_OFFLINE_ADVISORIES = VERIFIED_CURATED_ADVISORIES.map((adv) => ({
  id: adv.id,
  ecosystem: adv.ecosystem as 'npm' | 'PyPI' | 'Go' | 'crates.io',
  package: adv.package,
  vulnerableVersions: (version: string) => satisfiesRange(version, adv.affectedRange),
  affectedRange: adv.affectedRange,
  fixedVersion: adv.fixedVersion || '',
  title: adv.title,
  severity: adv.severity,
  cwe: adv.cwe || 'CWE-1395: Dependency Vulnerability',
  referenceUrl: adv.referenceUrl
}))

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB limit
const MAX_PACKAGE_RECORDS = 5000

/**
 * Parses dependencies from a single manifest or lockfile.
 */
export function parseManifestDependencies(
  filePath: string,
  content: string
): DependencyPackage[] {
  const packages: DependencyPackage[] = []
  if (!content || typeof content !== 'string') return packages
  if (content.length > MAX_FILE_SIZE) {
    console.warn(`[DependencyScanner] File ${filePath} exceeds 2MB limit; skipping.`)
    return packages
  }

  const fileName = filePath.split('/').pop()?.toLowerCase() || ''

  // 1. NPM: package.json
  if (fileName === 'package.json') {
    try {
      const parsed = JSON.parse(content)
      const deps = parsed.dependencies || {}
      const devDeps = parsed.devDependencies || {}
      const peerDeps = parsed.peerDependencies || {}
      const optDeps = parsed.optionalDependencies || {}
      const jsonLines = content.split('\n')

      const addGroup = (group: Record<string, any>, scope: DependencyScope) => {
        for (const [rawName, rawVer] of Object.entries(group)) {
          if (!rawName) continue
          const verStr = String(rawVer || '').trim()
          let lineNum = 1
          for (let li = 0; li < jsonLines.length; li++) {
            if (jsonLines[li].includes(`"${rawName}"`)) {
              lineNum = li + 1
              break
            }
          }

          let name = rawName
          let cleanVer = verStr.replace(/^[\^~>=<]+/, '').trim()
          let isExact = isExactVersion(verStr)
          let method: ResolutionMethod = isExact ? 'LOCKFILE_EXACT' : 'MANIFEST_DECLARED'
          let confidence: ResolutionConfidence = isExact ? 'HIGH' : 'MEDIUM'
          let completeness: 'COMPLETE' | 'INFERRED' | 'UNRESOLVED' = isExact ? 'COMPLETE' : 'INFERRED'

          // Handle aliased dependencies: e.g. "my-lodash": "npm:lodash@^4.17.20"
          if (verStr.startsWith('npm:')) {
            const aliasSpec = verStr.slice(4).trim()
            const atIdx = aliasSpec.lastIndexOf('@')
            if (atIdx > 0) {
              name = aliasSpec.slice(0, atIdx).trim()
              const aliasVer = aliasSpec.slice(atIdx + 1).trim()
              isExact = isExactVersion(aliasVer)
              cleanVer = aliasVer.replace(/^[\^~>=<]+/, '').trim()
              method = isExact ? 'LOCKFILE_EXACT' : 'MANIFEST_DECLARED'
              confidence = isExact ? 'HIGH' : 'MEDIUM'
              completeness = isExact ? 'COMPLETE' : 'INFERRED'
            }
          } else if (
            verStr.startsWith('git') ||
            verStr.startsWith('http') ||
            verStr.startsWith('file:') ||
            verStr.startsWith('link:') ||
            verStr.startsWith('workspace:')
          ) {
            isExact = false
            cleanVer = ''
            method = 'MANIFEST_RANGE_UNRESOLVED'
            confidence = 'LOW'
            completeness = 'UNRESOLVED'
          }

          packages.push({
            name,
            ecosystem: 'npm',
            declaredVersion: verStr,
            version: cleanVer || undefined,
            resolvedVersion: isExact ? cleanVer : undefined,
            isExact,
            scope,
            dependencyType: 'direct',
            manifestFile: filePath,
            line: lineNum,
            resolutionMethod: method,
            resolutionConfidence: confidence,
            completeness,
            purl: buildPurl('npm', name, cleanVer || '0.0.0'),
            advisoryCount: 0
          })
        }
      }

      addGroup(deps, 'production')
      addGroup(devDeps, 'development')
      addGroup(peerDeps, 'peer')
      addGroup(optDeps, 'optional')
    } catch (e) {}
  }

  // 2. NPM: package-lock.json (Supports v1, v2, v3 schemas)
  else if (fileName === 'package-lock.json' || fileName === 'npm-shrinkwrap.json') {
    try {
      const parsed = JSON.parse(content)
      const jsonLines = content.split('\n')

      // v2/v3 Schema: "packages"
      if (parsed.packages && typeof parsed.packages === 'object') {
        for (const [pkgKey, pkgData] of Object.entries(parsed.packages)) {
          if (!pkgKey || pkgKey === '') continue
          const data = pkgData as any
          const version = data.version ? String(data.version).trim() : ''
          if (!version) continue

          const isDirect = !pkgKey.includes('node_modules/') || pkgKey.split('node_modules/').length === 2
          const parts = pkgKey.split('node_modules/').filter(Boolean).map((p) => p.replace(/\/$/, ''))
          const name = parts[parts.length - 1]
          if (!name) continue

          let lineNum = 1
          for (let li = 0; li < jsonLines.length; li++) {
            if (jsonLines[li].includes(`"${pkgKey}"`) || jsonLines[li].includes(`"${name}"`)) {
              lineNum = li + 1
              break
            }
          }

          packages.push({
            name,
            ecosystem: 'npm',
            version,
            declaredVersion: data.version,
            resolvedVersion: version,
            isExact: true,
            scope: data.dev ? 'development' : 'production',
            dependencyType: isDirect ? 'direct' : 'transitive',
            dependencyPath: parts,
            parentPackage: parts.length > 1 ? parts[parts.length - 2] : undefined,
            manifestFile: filePath,
            lockfile: filePath,
            line: lineNum,
            resolutionMethod: 'LOCKFILE_EXACT',
            resolutionConfidence: 'HIGH',
            completeness: 'COMPLETE',
            purl: buildPurl('npm', name, version),
            advisoryCount: 0
          })
        }
      }
      // v1 Schema fallback: "dependencies"
      else if (parsed.dependencies && typeof parsed.dependencies === 'object') {
        const processV1 = (depsObj: Record<string, any>, currentPath: string[]) => {
          for (const [name, data] of Object.entries(depsObj)) {
            if (!name || !data || !data.version) continue
            const ver = String(data.version).trim()
            const fullPath = [...currentPath, name]

            packages.push({
              name,
              ecosystem: 'npm',
              version: ver,
              resolvedVersion: ver,
              isExact: true,
              scope: data.dev ? 'development' : 'production',
              dependencyType: currentPath.length === 0 ? 'direct' : 'transitive',
              dependencyPath: fullPath,
              parentPackage: currentPath.length > 0 ? currentPath[currentPath.length - 1] : undefined,
              manifestFile: filePath,
              lockfile: filePath,
              resolutionMethod: 'LOCKFILE_EXACT',
              resolutionConfidence: 'HIGH',
              completeness: 'COMPLETE',
              purl: buildPurl('npm', name, ver),
              advisoryCount: 0
            })

            if (data.dependencies && typeof data.dependencies === 'object') {
              processV1(data.dependencies, fullPath)
            }
          }
        }
        processV1(parsed.dependencies, [])
      }
    } catch (e) {}
  }

  // 3. NPM / Yarn: yarn.lock (v1 format)
  else if (fileName === 'yarn.lock') {
    const lines = content.split('\n')
    let currentNames: string[] = []
    let currentVersion = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim() || line.startsWith('#')) continue

      if (!line.startsWith(' ') && line.includes(':')) {
        // Entry header: "lodash@^4.17.20", "express@4.19.2:"
        currentNames = line
          .replace(/:$/, '')
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        currentVersion = ''
      } else if (line.trim().startsWith('version ')) {
        const vMatch = line.match(/version\s+["']([^"']+)["']/)
        if (vMatch) {
          currentVersion = vMatch[1].trim()
          for (const spec of currentNames) {
            const atIdx = spec.lastIndexOf('@')
            const name = atIdx > 0 ? spec.slice(0, atIdx) : spec
            const declared = atIdx > 0 ? spec.slice(atIdx + 1) : currentVersion

            packages.push({
              name,
              ecosystem: 'npm',
              version: currentVersion,
              declaredVersion: declared,
              resolvedVersion: currentVersion,
              isExact: true,
              dependencyType: 'transitive',
              manifestFile: filePath,
              lockfile: filePath,
              line: i + 1,
              resolutionMethod: 'LOCKFILE_EXACT',
              resolutionConfidence: 'HIGH',
              completeness: 'COMPLETE',
              purl: buildPurl('npm', name, currentVersion),
              advisoryCount: 0
            })
            break // Record once per block
          }
        }
      }
    }
  }

  // 4. Python: requirements.txt
  else if (fileName === 'requirements.txt') {
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lineNum = i + 1
      if (!line || line.startsWith('#') || line.startsWith('-r') || line.startsWith('-i')) continue

      let cleanLine = line.split(';')[0].trim()
      let gitEggMatch = null
      if (cleanLine.includes('#egg=')) {
        gitEggMatch = cleanLine.match(/#egg=([a-zA-Z0-9_.-]+)/i)
      }
      cleanLine = cleanLine.split('#')[0].trim()
      if (!cleanLine && !gitEggMatch) continue

      const directUrlMatch = cleanLine.match(/^([a-zA-Z0-9_.-]+)\s*@\s*(https?:|git\+)/i)

      if (gitEggMatch) {
        const name = gitEggMatch[1]
        packages.push({
          name,
          ecosystem: 'PyPI',
          declaredVersion: cleanLine,
          isExact: false,
          scope: 'production',
          dependencyType: 'direct',
          manifestFile: filePath,
          line: lineNum,
          resolutionMethod: 'MANIFEST_RANGE_UNRESOLVED',
          resolutionConfidence: 'LOW',
          completeness: 'UNRESOLVED',
          purl: buildPurl('PyPI', name, '0.0.0'),
          advisoryCount: 0
        })
        continue
      } else if (directUrlMatch) {
        const name = directUrlMatch[1]
        packages.push({
          name,
          ecosystem: 'PyPI',
          declaredVersion: cleanLine,
          isExact: false,
          scope: 'production',
          dependencyType: 'direct',
          manifestFile: filePath,
          line: lineNum,
          resolutionMethod: 'MANIFEST_RANGE_UNRESOLVED',
          resolutionConfidence: 'LOW',
          completeness: 'UNRESOLVED',
          purl: buildPurl('PyPI', name, '0.0.0'),
          advisoryCount: 0
        })
        continue
      }

      // Check version specifier (exact '==' vs range/compound)
      const specMatch = cleanLine.match(/^([a-zA-Z0-9_.-]+)\s*([>=<~^!].*)$/)
      if (specMatch) {
        const name = specMatch[1].trim()
        const fullSpec = specMatch[2].trim()
        const exactMatch = fullSpec.match(/^==\s*([a-zA-Z0-9_.-]+)$/)

        if (exactMatch) {
          const ver = exactMatch[1].trim()
          packages.push({
            name,
            ecosystem: 'PyPI',
            version: ver,
            declaredVersion: `==${ver}`,
            resolvedVersion: ver,
            isExact: true,
            scope: 'production',
            dependencyType: 'direct',
            manifestFile: filePath,
            line: lineNum,
            resolutionMethod: 'LOCKFILE_EXACT',
            resolutionConfidence: 'HIGH',
            completeness: 'COMPLETE',
            purl: buildPurl('PyPI', name, ver),
            advisoryCount: 0
          })
        } else {
          // Range or compound range specifier
          const primaryVerMatch = fullSpec.match(/([0-9]+[a-zA-Z0-9_.-]*)/)
          const cleanVer = primaryVerMatch ? primaryVerMatch[1] : undefined
          packages.push({
            name,
            ecosystem: 'PyPI',
            version: cleanVer,
            declaredVersion: fullSpec,
            isExact: false,
            scope: 'production',
            dependencyType: 'direct',
            manifestFile: filePath,
            line: lineNum,
            resolutionMethod: 'MANIFEST_RANGE_UNRESOLVED',
            resolutionConfidence: 'MEDIUM',
            completeness: 'INFERRED',
            purl: buildPurl('PyPI', name, cleanVer || '0.0.0'),
            advisoryCount: 0
          })
        }
      } else {
        const barePkg = cleanLine.split(/[[\s]/)[0]
        if (barePkg && /^[a-zA-Z0-9_.-]+$/.test(barePkg)) {
          packages.push({
            name: barePkg,
            ecosystem: 'PyPI',
            isExact: false,
            scope: 'production',
            dependencyType: 'direct',
            manifestFile: filePath,
            line: lineNum,
            resolutionMethod: 'MANIFEST_RANGE_UNRESOLVED',
            resolutionConfidence: 'LOW',
            completeness: 'INFERRED',
            purl: buildPurl('PyPI', barePkg, '0.0.0'),
            advisoryCount: 0
          })
        }
      }
    }
  }

  // 5. Python: poetry.lock
  else if (fileName === 'poetry.lock') {
    const lines = content.split('\n')
    let inPkg = false
    let currentName = ''
    let currentVer = ''
    let currentCategory = 'main'

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line === '[[package]]') {
        if (currentName && currentVer) {
          packages.push({
            name: currentName,
            ecosystem: 'PyPI',
            version: currentVer,
            resolvedVersion: currentVer,
            isExact: true,
            scope: currentCategory === 'dev' ? 'development' : 'production',
            dependencyType: 'transitive',
            manifestFile: filePath,
            lockfile: filePath,
            line: i + 1,
            resolutionMethod: 'LOCKFILE_EXACT',
            resolutionConfidence: 'HIGH',
            completeness: 'COMPLETE',
            purl: buildPurl('PyPI', currentName, currentVer),
            advisoryCount: 0
          })
        }
        inPkg = true
        currentName = ''
        currentVer = ''
        currentCategory = 'main'
        continue
      }
      if (inPkg) {
        if (line.startsWith('name = ')) {
          currentName = line.replace('name = ', '').replace(/["']/g, '').trim()
        } else if (line.startsWith('version = ')) {
          currentVer = line.replace('version = ', '').replace(/["']/g, '').trim()
        } else if (line.startsWith('category = ')) {
          currentCategory = line.replace('category = ', '').replace(/["']/g, '').trim()
        }
      }
    }
    if (currentName && currentVer) {
      packages.push({
        name: currentName,
        ecosystem: 'PyPI',
        version: currentVer,
        resolvedVersion: currentVer,
        isExact: true,
        scope: currentCategory === 'dev' ? 'development' : 'production',
        dependencyType: 'transitive',
        manifestFile: filePath,
        lockfile: filePath,
        resolutionMethod: 'LOCKFILE_EXACT',
        resolutionConfidence: 'HIGH',
        completeness: 'COMPLETE',
        purl: buildPurl('PyPI', currentName, currentVer),
        advisoryCount: 0
      })
    }
  }

  // 6. Go: go.mod
  else if (fileName === 'go.mod') {
    const lines = content.split('\n')
    let inRequire = false
    let inReplace = false
    const replacements = new Map<string, { targetModule: string; targetVersion?: string; isLocal: boolean }>()

    // Pass 1: Parse replace directives
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith('replace (')) {
        inReplace = true
        continue
      }
      if (inReplace && line === ')') {
        inReplace = false
        continue
      }
      if (inReplace || line.startsWith('replace ')) {
        const repStr = line.replace(/^replace\s+/, '').trim()
        if (repStr.includes('=>')) {
          const [left, right] = repStr.split('=>').map((s) => s.trim().split('//')[0].trim())
          const leftMod = left.split(/\s+/)[0]
          const rightParts = right.split(/\s+/)
          const targetModule = rightParts[0]
          const targetVersion = rightParts.length > 1 ? rightParts[1].replace(/^v/, '') : undefined
          const isLocal = targetModule.startsWith('.') || targetModule.startsWith('/')
          replacements.set(leftMod, { targetModule, targetVersion, isLocal })
        }
      }
    }

    // Pass 2: Parse require dependencies with replacement resolution
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lineNum = i + 1
      if (line.startsWith('require (')) {
        inRequire = true
        continue
      }
      if (inRequire && line === ')') {
        inRequire = false
        continue
      }
      if (inRequire || line.startsWith('require ')) {
        const parts = line.replace('require ', '').trim().split(/\s+/)
        if (parts.length >= 2 && !parts[0].startsWith('//')) {
          const originalName = parts[0]
          let ver = parts[1].replace(/^v/, '')
          const isIndirect = line.includes('// indirect')

          let effectiveName = originalName
          let declaredVer = parts[1]
          let isExact = isExactVersion(ver)
          let method: ResolutionMethod = 'LOCKFILE_EXACT'
          let confidence: ResolutionConfidence = 'HIGH'
          let completeness: 'COMPLETE' | 'INFERRED' | 'UNRESOLVED' = 'COMPLETE'

          if (replacements.has(originalName)) {
            const rep = replacements.get(originalName)!
            declaredVer = `${parts[1]} => ${rep.targetModule}${rep.targetVersion ? ` v${rep.targetVersion}` : ''}`
            if (rep.isLocal) {
              isExact = false
              ver = ''
              method = 'MANIFEST_RANGE_UNRESOLVED'
              confidence = 'LOW'
              completeness = 'UNRESOLVED'
            } else if (rep.targetVersion) {
              effectiveName = rep.targetModule
              ver = rep.targetVersion
              isExact = true
            }
          }

          packages.push({
            name: effectiveName,
            ecosystem: 'Go',
            version: ver || undefined,
            declaredVersion: declaredVer,
            resolvedVersion: isExact ? ver : undefined,
            isExact,
            scope: 'production',
            dependencyType: isIndirect ? 'transitive' : 'direct',
            manifestFile: filePath,
            line: lineNum,
            resolutionMethod: method,
            resolutionConfidence: confidence,
            completeness,
            purl: buildPurl('Go', effectiveName, ver || '0.0.0'),
            advisoryCount: 0
          })
        }
      }
    }
  }

  // 7. Rust: Cargo.toml
  else if (fileName === 'cargo.toml') {
    const lines = content.split('\n')
    let currentScope: DependencyScope = 'production'
    let inDeps = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const lineNum = i + 1
      if (
        line.startsWith('[dependencies]') ||
        (line.startsWith('[target.') && line.endsWith('.dependencies]'))
      ) {
        inDeps = true
        currentScope = 'production'
        continue
      } else if (
        line.startsWith('[dev-dependencies]') ||
        (line.startsWith('[target.') && line.endsWith('.dev-dependencies]'))
      ) {
        inDeps = true
        currentScope = 'development'
        continue
      } else if (
        line.startsWith('[build-dependencies]') ||
        (line.startsWith('[target.') && line.endsWith('.build-dependencies]'))
      ) {
        inDeps = true
        currentScope = 'development'
        continue
      } else if (inDeps && line.startsWith('[')) {
        inDeps = false
        continue
      }

      if (inDeps && line.includes('=')) {
        const eqIdx = line.indexOf('=')
        const pkgName = line.slice(0, eqIdx).trim()
        const verPart = line.slice(eqIdx + 1).trim()
        if (pkgName && verPart) {
          // Check for renamed package: my_pkg = { package = "real-pkg", version = "1.0.0" }
          const pkgMatch = verPart.match(/package\s*=\s*["']([^"']+)["']/)
          const effectiveName = pkgMatch ? pkgMatch[1].trim() : pkgName

          // Check workspace dependency
          const isWorkspace = verPart.includes('workspace = true') || verPart.includes('workspace=true')

          const verMatch = verPart.match(/version\s*=\s*["']([^"']+)["']/) || verPart.match(/["']([^"']+)["']/)
          const ver = isWorkspace ? undefined : verMatch ? verMatch[1] : undefined
          const isExact = isWorkspace ? false : isExactVersion(ver || '')
          const cleanVer = ver?.replace(/^[\^~>=<]+/, '')

          packages.push({
            name: effectiveName,
            ecosystem: 'crates.io',
            version: cleanVer,
            declaredVersion: isWorkspace ? 'workspace:true' : ver,
            resolvedVersion: isExact ? cleanVer : undefined,
            isExact,
            scope: currentScope,
            dependencyType: 'direct',
            manifestFile: filePath,
            line: lineNum,
            resolutionMethod: isExact ? 'LOCKFILE_EXACT' : 'MANIFEST_DECLARED',
            resolutionConfidence: isExact ? 'HIGH' : isWorkspace ? 'LOW' : 'MEDIUM',
            completeness: isExact ? 'COMPLETE' : isWorkspace ? 'UNRESOLVED' : 'INFERRED',
            purl: buildPurl('crates.io', effectiveName, cleanVer || '0.0.0'),
            advisoryCount: 0
          })
        }
      }
    }
  }

  // 8. Rust: Cargo.lock
  else if (fileName === 'cargo.lock') {
    const lines = content.split('\n')
    let inPkg = false
    let currentName = ''
    let currentVer = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line === '[[package]]') {
        if (currentName && currentVer) {
          packages.push({
            name: currentName,
            ecosystem: 'crates.io',
            version: currentVer,
            resolvedVersion: currentVer,
            isExact: true,
            scope: 'production',
            dependencyType: 'transitive',
            manifestFile: filePath,
            lockfile: filePath,
            line: i + 1,
            resolutionMethod: 'LOCKFILE_EXACT',
            resolutionConfidence: 'HIGH',
            completeness: 'COMPLETE',
            purl: buildPurl('crates.io', currentName, currentVer),
            advisoryCount: 0
          })
        }
        inPkg = true
        currentName = ''
        currentVer = ''
        continue
      }
      if (inPkg) {
        if (line.startsWith('name = ')) {
          currentName = line.replace('name = ', '').replace(/["']/g, '').trim()
        } else if (line.startsWith('version = ')) {
          currentVer = line.replace('version = ', '').replace(/["']/g, '').trim()
        }
      }
    }
    if (currentName && currentVer) {
      packages.push({
        name: currentName,
        ecosystem: 'crates.io',
        version: currentVer,
        resolvedVersion: currentVer,
        isExact: true,
        scope: 'production',
        dependencyType: 'transitive',
        manifestFile: filePath,
        lockfile: filePath,
        resolutionMethod: 'LOCKFILE_EXACT',
        resolutionConfidence: 'HIGH',
        completeness: 'COMPLETE',
        purl: buildPurl('crates.io', currentName, currentVer),
        advisoryCount: 0
      })
    }
  }

  // 9. Java: Maven pom.xml
  else if (fileName === 'pom.xml') {
    const lines = content.split('\n')
    let inDep = false
    let inDepManagement = false
    let groupId = ''
    let artifactId = ''
    let version = ''
    let scope: DependencyScope = 'production'
    let startLine = 1

    // Extract properties block for parameter interpolation
    const properties: Record<string, string> = {}
    const propsBlockMatch = content.match(/<properties>([\s\S]*?)<\/properties>/i)
    if (propsBlockMatch) {
      const propMatches = propsBlockMatch[1].matchAll(/<([a-zA-Z0-9_.-]+)>([^<]+)<\/\1>/g)
      for (const m of propMatches) {
        properties[m[1].trim()] = m[2].trim()
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.includes('<dependencyManagement>')) {
        inDepManagement = true
      } else if (line.includes('</dependencyManagement>')) {
        inDepManagement = false
      }

      if (line.includes('<dependency>')) {
        inDep = true
        groupId = ''
        artifactId = ''
        version = ''
        scope = inDepManagement ? 'optional' : 'production'
        startLine = i + 1
        continue
      }
      if (inDep && line.includes('</dependency>')) {
        inDep = false
        if (groupId && artifactId) {
          const fullName = `${groupId}:${artifactId}`
          const rawVersion = version
          let resolvedVer = version
          let isExact = isExactVersion(version)
          let method: ResolutionMethod = isExact ? 'LOCKFILE_EXACT' : 'MANIFEST_DECLARED'
          let confidence: ResolutionConfidence = isExact ? 'HIGH' : 'MEDIUM'
          let completeness: 'COMPLETE' | 'INFERRED' | 'UNRESOLVED' = isExact ? 'COMPLETE' : 'INFERRED'

          // Handle Maven properties: ${spring.version}
          if (rawVersion && rawVersion.startsWith('${') && rawVersion.endsWith('}')) {
            const propName = rawVersion.slice(2, -1).trim()
            if (properties[propName]) {
              resolvedVer = properties[propName]
              isExact = isExactVersion(resolvedVer)
              method = isExact ? 'LOCKFILE_EXACT' : 'MANIFEST_DECLARED'
              confidence = isExact ? 'HIGH' : 'MEDIUM'
              completeness = isExact ? 'COMPLETE' : 'INFERRED'
            } else {
              // Undefined property placeholder: cannot be fabricated as exact
              resolvedVer = ''
              isExact = false
              method = 'MANIFEST_RANGE_UNRESOLVED'
              confidence = 'LOW'
              completeness = 'UNRESOLVED'
            }
          }

          packages.push({
            name: fullName,
            ecosystem: 'Maven',
            version: resolvedVer || undefined,
            declaredVersion: rawVersion || undefined,
            resolvedVersion: isExact ? resolvedVer : undefined,
            isExact,
            scope,
            dependencyType: 'direct',
            manifestFile: filePath,
            line: startLine,
            resolutionMethod: method,
            resolutionConfidence: confidence,
            completeness,
            purl: buildPurl('Maven', fullName, resolvedVer || '0.0.0'),
            advisoryCount: 0
          })
        }
        continue
      }
      if (inDep) {
        if (line.includes('<groupId>')) {
          groupId = line.replace(/<[^>]+>/g, '').trim()
        } else if (line.includes('<artifactId>')) {
          artifactId = line.replace(/<[^>]+>/g, '').trim()
        } else if (line.includes('<version>')) {
          version = line.replace(/<[^>]+>/g, '').trim()
        } else if (line.includes('<scope>')) {
          const s = line.replace(/<[^>]+>/g, '').trim().toLowerCase()
          scope = s === 'test' ? 'development' : inDepManagement ? 'optional' : 'production'
        }
      }
    }
  }

  return packages.slice(0, MAX_PACKAGE_RECORDS)
}

/**
 * Orchestrates multi-file manifest and lockfile precedence, detecting competing
 * lockfiles and merging direct declarations with resolved transitive locks.
 */
export function resolveDependenciesWithLockfiles(
  fileContents: Map<string, string>
): {
  packages: DependencyPackage[]
  ambiguities: LockfileAmbiguity[]
  lockfileStatus: 'FULL_LOCKFILE' | 'PARTIAL_LOCKFILE' | 'MANIFEST_ONLY' | 'COMPETING_LOCKFILES'
} {
  const ambiguities: LockfileAmbiguity[] = []
  const files = Array.from(fileContents.keys())

  // Check npm lockfiles
  const hasPkgJson = files.some((f) => f.endsWith('package.json'))
  const hasPkgLock = files.some((f) => f.endsWith('package-lock.json'))
  const hasYarnLock = files.some((f) => f.endsWith('yarn.lock'))
  const hasPnpmLock = files.some((f) => f.endsWith('pnpm-lock.yaml'))

  const npmLockCount = [hasPkgLock, hasYarnLock, hasPnpmLock].filter(Boolean).length
  if (npmLockCount > 1) {
    const detected = []
    if (hasPkgLock) detected.push('package-lock.json')
    if (hasYarnLock) detected.push('yarn.lock')
    if (hasPnpmLock) detected.push('pnpm-lock.yaml')
    ambiguities.push({
      ecosystem: 'npm',
      detectedLockfiles: detected,
      chosenLockfile: hasPkgLock ? 'package-lock.json' : 'yarn.lock',
      explanation: `Competing npm lockfiles found (${detected.join(', ')}). Chosen ${hasPkgLock ? 'package-lock.json' : 'yarn.lock'} according to canonical precedence.`
    })
  } else if (hasPnpmLock) {
    ambiguities.push({
      ecosystem: 'npm',
      detectedLockfiles: ['pnpm-lock.yaml'],
      chosenLockfile: 'pnpm-lock.yaml (partial/unparsed)',
      explanation: 'pnpm-lock.yaml was detected but transitive resolution is unsupported in this version. Direct manifest declarations evaluated in partial/inferred mode; runtime transitive vulnerability exposure cannot be fully confirmed.'
    })
  }

  // Parse all manifests and lockfiles
  const directManifestPackages: DependencyPackage[] = []
  const lockfilePackages: DependencyPackage[] = []

  for (const [filePath, content] of fileContents.entries()) {
    const fileName = filePath.split('/').pop()?.toLowerCase() || ''
    const isLockfile =
      fileName === 'package-lock.json' ||
      fileName === 'yarn.lock' ||
      fileName === 'poetry.lock' ||
      fileName === 'cargo.lock'

    const parsed = parseManifestDependencies(filePath, content)
    if (isLockfile) {
      lockfilePackages.push(...parsed)
    } else {
      directManifestPackages.push(...parsed)
    }
  }

  // If no lockfiles found, return direct packages with UNRESOLVED or PARTIAL status
  if (lockfilePackages.length === 0) {
    return {
      packages: directManifestPackages,
      ambiguities,
      lockfileStatus: hasPnpmLock ? 'PARTIAL_LOCKFILE' : 'MANIFEST_ONLY'
    }
  }

  // Merge lockfile resolutions into direct manifest packages
  const lockfileMap = new Map<string, DependencyPackage>()
  for (const lockPkg of lockfilePackages) {
    const key = `${lockPkg.ecosystem.toLowerCase()}:${lockPkg.name.toLowerCase()}`
    if (!lockfileMap.has(key)) {
      lockfileMap.set(key, lockPkg)
    }
  }

  const mergedPackages: DependencyPackage[] = []
  const claimedLockKeys = new Set<string>()

  // 1. Process direct manifest packages and resolve their exact installed versions
  for (const directPkg of directManifestPackages) {
    const key = `${directPkg.ecosystem.toLowerCase()}:${directPkg.name.toLowerCase()}`
    const lockMatch = lockfileMap.get(key)

    if (lockMatch && lockMatch.version) {
      claimedLockKeys.add(`${key}@${lockMatch.version}`)
      mergedPackages.push({
        ...directPkg,
        resolvedVersion: lockMatch.version,
        isExact: true,
        lockfile: lockMatch.lockfile,
        resolutionMethod: 'LOCKFILE_EXACT',
        resolutionConfidence: 'HIGH',
        completeness: 'COMPLETE',
        purl: buildPurl(directPkg.ecosystem, directPkg.name, lockMatch.version)
      })
    } else {
      mergedPackages.push(directPkg)
    }
  }

  // 2. Add transitive dependencies from lockfile that were not direct dependencies
  for (const lockPkg of lockfilePackages) {
    const versionKey = `${lockPkg.ecosystem.toLowerCase()}:${lockPkg.name.toLowerCase()}@${lockPkg.version}`
    if (!claimedLockKeys.has(versionKey)) {
      claimedLockKeys.add(versionKey)
      mergedPackages.push({
        ...lockPkg,
        dependencyType: 'transitive'
      })
    }
  }

  const status =
    ambiguities.length > 0
      ? 'COMPETING_LOCKFILES'
      : mergedPackages.some((p) => p.isExact)
      ? 'FULL_LOCKFILE'
      : 'PARTIAL_LOCKFILE'

  return {
    packages: mergedPackages,
    ambiguities,
    lockfileStatus: status
  }
}

/**
 * Correlates parsed packages against pluggable advisory providers.
 */
export async function correlateDependencyVulnerabilities(
  packages: DependencyPackage[],
  repoRef?: string,
  provider?: IAdvisoryProvider
): Promise<{ findings: SecurityFinding[]; updatedPackages: DependencyPackage[] }> {
  const activeProvider = provider || new VerifiedOfflineAdvisoryProvider()
  const findings: SecurityFinding[] = []
  const updatedPackages: DependencyPackage[] = []

  for (let i = 0; i < packages.length; i++) {
    const pkg = { ...packages[i] }
    const result = await activeProvider.queryPackage(pkg)

    pkg.advisoryStatus = result.status

    if (result.status === 'CONFIRMED_AFFECTED' && result.advisories.length > 0) {
      pkg.advisoryCount = result.advisories.length
      pkg.advisories = result.advisories.map((adv) => ({
        id: adv.id,
        title: adv.title,
        severity: adv.severity,
        cvssScore: adv.cvssScore,
        affectedVersions: adv.affectedRange,
        fixedVersion: adv.fixedVersion,
        referenceUrl: adv.referenceUrl
      }))

      for (const adv of result.advisories) {
        const findingId = `SEC-DEP-${findings.length + 1}`
        const isExact = pkg.isExact
        const versionStr = pkg.resolvedVersion || pkg.version || 'unknown'

        findings.push({
          id: findingId,
          ruleId: `RPM-DEP-${adv.id}`,
          ruleName: `Vulnerable Dependency: ${pkg.name}@${versionStr}`,
          category: 'DEPENDENCY_VULNERABILITY',
          severity: adv.severity,
          confidence: isExact ? 'HIGH' : 'MEDIUM',
          repository: repoRef,
          filePath: pkg.lockfile || pkg.manifestFile,
          startLine: pkg.line || 1,
          endLine: pkg.line || 1,
          detectionMethod: 'ADVISORY_LOOKUP',
          evidenceExcerpt: `"${pkg.name}": "${versionStr}" (Affected: ${adv.affectedRange})`,
          explanation: `Dependency ${pkg.name}@${versionStr} is vulnerable to ${adv.id}: ${adv.title}.${adv.fixedVersion ? ` Fixed in version ${adv.fixedVersion}.` : ''}`,
          preconditionsAndLimitations: isExact
            ? `Verified against exact resolved version ${versionStr} from lockfile ${pkg.lockfile || pkg.manifestFile}.`
            : `Matched against manifest declared range ${pkg.declaredVersion || versionStr}. Requires lockfile to confirm runtime exposure.`,
          remediation: adv.fixedVersion
            ? `Upgrade ${pkg.name} to version ${adv.fixedVersion} or higher in ${pkg.manifestFile}.`
            : `Review upstream advisory ${adv.id} for workaround mitigations.`,
          advisoryReference: `${adv.id}${adv.cwe ? ` • ${adv.cwe}` : ''}`,
          timestamp: new Date().toISOString(),
          verificationStatus: 'VERIFIED_ADVISORY'
        })
      }
    } else if (result.status === 'UNRESOLVED_RANGE') {
      pkg.advisoryCount = 0
    } else {
      pkg.advisoryCount = 0
    }

    updatedPackages.push(pkg)
  }

  return { findings, updatedPackages }
}
