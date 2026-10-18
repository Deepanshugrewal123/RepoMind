// src/services/security/sbomGenerator.ts
// Reproducible, schema-compliant CycloneDX v1.5 JSON SBOM generator for software supply-chain transparency.

import {
  DependencyPackage,
  DependencyGraphData,
  CycloneDXSBOM,
  CycloneDXComponent,
  CycloneDXDependencyLink,
  CycloneDXVulnerability
} from './types'

export interface SBOMGenerationOptions {
  repoName: string
  ref?: string
  isLockfileResolved?: boolean
  deterministic?: boolean
  timestamp?: string
}

/**
 * Builds a standard Package URL (PURL) string per the specification.
 * E.g. pkg:npm/%40angular/core@16.0.0, pkg:pypi/requests@2.25.0
 */
export function buildPurl(ecosystem: string, name: string, version: string): string {
  const eco = ecosystem.toLowerCase()
  const cleanVer = version || '0.0.0'

  if (eco === 'npm' || eco === 'javascript' || eco === 'typescript') {
    if (name.startsWith('@')) {
      const parts = name.split('/')
      const scope = encodeURIComponent(parts[0])
      const pkg = parts[1]
      return `pkg:npm/${scope}/${pkg}@${cleanVer}`
    }
    return `pkg:npm/${name}@${cleanVer}`
  }

  if (eco === 'pypi' || eco === 'python') {
    const norm = name.toLowerCase().replace(/[-_.]+/g, '-')
    return `pkg:pypi/${norm}@${cleanVer}`
  }

  if (eco === 'go' || eco === 'golang') {
    return `pkg:golang/${name}@${cleanVer}`
  }

  if (eco === 'crates.io' || eco === 'cargo' || eco === 'rust') {
    return `pkg:cargo/${name.toLowerCase()}@${cleanVer}`
  }

  if (eco === 'maven' || eco === 'java') {
    if (name.includes(':')) {
      const [groupId, artifactId] = name.split(':')
      return `pkg:maven/${groupId}/${artifactId}@${cleanVer}`
    }
    return `pkg:maven/${name}@${cleanVer}`
  }

  return `pkg:generic/${name}@${cleanVer}`
}

/**
 * Generates an RFC 4122 compliant UUID urn:uuid:xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
 */
export function generateRFC4122UUID(deterministic: boolean = false): string {
  if (deterministic) {
    return 'urn:uuid:00000000-0000-4000-8000-000000000001'
  }
  const hexChars = '0123456789abcdef'
  let uuid = 'urn:uuid:'
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-'
    } else if (i === 14) {
      uuid += '4'
    } else if (i === 19) {
      uuid += hexChars[(Math.random() * 4 | 8)]
    } else {
      uuid += hexChars[Math.floor(Math.random() * 16)]
    }
  }
  return uuid
}

/**
 * Generates a valid CycloneDX v1.5 JSON document.
 * Enforces deterministic sorting of components and dependency links.
 */
export function generateCycloneDXSBOM(
  packages: DependencyPackage[],
  graphData?: DependencyGraphData,
  options: SBOMGenerationOptions = { repoName: 'repository' }
): CycloneDXSBOM {
  const isLockfile = options.isLockfileResolved ?? false
  const timestamp = options.deterministic
    ? '2026-01-01T00:00:00Z'
    : (options.timestamp || new Date().toISOString())
  const serialNumber = generateRFC4122UUID(options.deterministic)

  // 1. Build Components
  const componentsMap = new Map<string, CycloneDXComponent>()

  for (const pkg of packages) {
    const ver = pkg.resolvedVersion || pkg.version || '0.0.0'
    const purl = pkg.purl || buildPurl(pkg.ecosystem, pkg.name, ver)

    if (!componentsMap.has(purl)) {
      const comp: CycloneDXComponent = {
        type: 'library',
        'bom-ref': purl,
        name: pkg.name,
        version: ver,
        purl,
        scope: pkg.scope === 'development' ? 'optional' : 'required',
        properties: [
          { name: 'repomind:ecosystem', value: pkg.ecosystem },
          { name: 'repomind:manifest', value: pkg.manifestFile },
          {
            name: 'repomind:dependencyType',
            value: pkg.dependencyType || 'direct'
          },
          {
            name: 'repomind:resolutionMethod',
            value: pkg.resolutionMethod || (isLockfile ? 'LOCKFILE_EXACT' : 'MANIFEST_DECLARED')
          },
          {
            name: 'repomind:confidence',
            value: pkg.resolutionConfidence || 'HIGH'
          }
        ]
      }

      if (pkg.license) {
        comp.licenses = [{ license: { id: pkg.license } }]
      }

      componentsMap.set(purl, comp)
    }
  }

  // Sort components alphabetically by purl for determinism
  const sortedComponents = Array.from(componentsMap.values()).sort((a, b) =>
    a.purl.localeCompare(b.purl)
  )

  // 2. Build Dependency Link Relations
  const dependencyLinks: CycloneDXDependencyLink[] = []
  const rootPurl = `pkg:generic/${options.repoName}@${options.ref || 'HEAD'}`
  const directPurls: string[] = []

  for (const comp of sortedComponents) {
    const isDirect = comp.properties?.some(
      (p) => p.name === 'repomind:dependencyType' && p.value === 'direct'
    )
    if (isDirect) {
      directPurls.push(comp.purl)
    }
  }

  // Root dependency record
  dependencyLinks.push({
    ref: rootPurl,
    dependsOn: directPurls.sort()
  })

  // Graph-level links if graphData is supplied
  if (graphData) {
    for (const [nodeId, node] of Object.entries(graphData.nodes)) {
      if (node.dependencies.length > 0) {
        const childPurls: string[] = []
        for (const childId of node.dependencies) {
          const childNode = graphData.nodes[childId]
          if (childNode) {
            childPurls.push(childNode.purl)
          }
        }
        if (childPurls.length > 0) {
          dependencyLinks.push({
            ref: node.purl,
            dependsOn: childPurls.sort()
          })
        }
      }
    }
  }

  // Sort dependency links alphabetically by ref
  dependencyLinks.sort((a, b) => a.ref.localeCompare(b.ref))

  // 3. Build Vulnerabilities block
  const vulnerabilities: CycloneDXVulnerability[] = []
  for (const pkg of packages) {
    if (pkg.advisories && pkg.advisories.length > 0) {
      const ver = pkg.resolvedVersion || pkg.version || '0.0.0'
      const purl = pkg.purl || buildPurl(pkg.ecosystem, pkg.name, ver)

      for (const adv of pkg.advisories) {
        vulnerabilities.push({
          id: adv.id,
          source: {
            name: 'RepoMind Advisory Intelligence',
            url: adv.referenceUrl
          },
          ratings: [
            {
              severity: adv.severity.toLowerCase(),
              score: adv.cvssScore,
              method: 'CVSSv3'
            }
          ],
          description: adv.title,
          recommendation: adv.fixedVersion
            ? `Upgrade ${pkg.name} to version ${adv.fixedVersion} or higher.`
            : 'Review advisory details and apply mitigations.',
          affects: [
            {
              ref: purl,
              versions: [
                {
                  version: ver,
                  status: 'affected'
                }
              ]
            }
          ]
        })
      }
    }
  }

  // Sort vulnerabilities by id then ref
  vulnerabilities.sort((a, b) => {
    const idCmp = a.id.localeCompare(b.id)
    if (idCmp !== 0) return idCmp
    return (a.affects[0]?.ref || '').localeCompare(b.affects[0]?.ref || '')
  })

  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    serialNumber,
    version: 1,
    metadata: {
      timestamp,
      tools: [
        {
          vendor: 'RepoMind',
          name: 'RepoMind Supply-Chain Intelligence Engine',
          version: '1.0.0'
        }
      ],
      component: {
        type: 'application',
        'bom-ref': rootPurl,
        name: options.repoName,
        version: options.ref || 'HEAD'
      },
      properties: [
        {
          name: 'repomind:resolutionStatus',
          value: isLockfile ? 'FULL_LOCKFILE' : 'MANIFEST_ONLY'
        },
        {
          name: 'repomind:componentCount',
          value: String(sortedComponents.length)
        }
      ]
    },
    components: sortedComponents,
    dependencies: dependencyLinks,
    vulnerabilities: vulnerabilities.length > 0 ? vulnerabilities : undefined
  }
}
