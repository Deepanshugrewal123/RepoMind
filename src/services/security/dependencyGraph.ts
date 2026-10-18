// src/services/security/dependencyGraph.ts
// Directed dependency graph construction, cycle detection, transitive path tracing,
// and parent attribution for software supply chain risk management.

import { DependencyPackage, DependencyNode, DependencyGraphData, DependencyScope } from './types'

export class DependencyGraphBuilder {
  private nodes = new Map<string, DependencyNode>()
  private directDeps = new Set<string>()
  private transitiveDeps = new Set<string>()
  private duplicates = new Map<string, Set<string>>()
  private cycles: string[][] = []

  /**
   * Generates a stable unique node key for the dependency graph.
   */
  public static makeNodeId(ecosystem: string, name: string, version: string): string {
    return `${ecosystem.toLowerCase()}:${name.toLowerCase()}@${version || '0.0.0'}`
  }

  /**
   * Builds a directed dependency graph from extracted packages and lockfile relationships.
   */
  public buildGraph(packages: DependencyPackage[]): DependencyGraphData {
    this.nodes.clear()
    this.directDeps.clear()
    this.transitiveDeps.clear()
    this.duplicates.clear()
    this.cycles = []

    // 1. Ingest all packages into node registry
    for (const pkg of packages) {
      const ver = pkg.resolvedVersion || pkg.version || '0.0.0'
      const id = DependencyGraphBuilder.makeNodeId(pkg.ecosystem, pkg.name, ver)
      const isDirect = pkg.dependencyType !== 'transitive'

      if (isDirect) {
        this.directDeps.add(id)
      } else {
        this.transitiveDeps.add(id)
      }

      // Track duplicate versions of the same package name
      const nameKey = `${pkg.ecosystem.toLowerCase()}:${pkg.name.toLowerCase()}`
      if (!this.duplicates.has(nameKey)) {
        this.duplicates.set(nameKey, new Set<string>())
      }
      this.duplicates.get(nameKey)!.add(ver)

      if (!this.nodes.has(id)) {
        this.nodes.set(id, {
          id,
          name: pkg.name,
          version: ver,
          ecosystem: pkg.ecosystem,
          isDirect,
          scope: pkg.scope || 'production',
          depth: isDirect ? 0 : (pkg.dependencyPath?.length || 1),
          purl: pkg.purl || `pkg:${pkg.ecosystem.toLowerCase()}/${pkg.name}@${ver}`,
          manifestFile: pkg.manifestFile,
          dependencies: [],
          dependents: [],
          advisories: pkg.advisories?.map((a) => a.id) || []
        })
      }
    }

    // 2. Link parent-child edges based on dependencyPath
    for (const pkg of packages) {
      if (pkg.dependencyPath && pkg.dependencyPath.length > 1) {
        const childVer = pkg.resolvedVersion || pkg.version || '0.0.0'
        const childId = DependencyGraphBuilder.makeNodeId(pkg.ecosystem, pkg.name, childVer)
        const parentName = pkg.dependencyPath[pkg.dependencyPath.length - 2]

        // Find parent node
        for (const [pId, pNode] of this.nodes.entries()) {
          if (
            pNode.ecosystem.toLowerCase() === pkg.ecosystem.toLowerCase() &&
            pNode.name.toLowerCase() === parentName.toLowerCase()
          ) {
            if (!pNode.dependencies.includes(childId)) {
              pNode.dependencies.push(childId)
            }
            const childNode = this.nodes.get(childId)
            if (childNode && !childNode.dependents.includes(pId)) {
              childNode.dependents.push(pId)
            }
            break
          }
        }
      }
    }

    // 3. Detect dependency cycles using depth-first search
    this.detectCycles()

    // 4. Transform duplicates map into serializable record
    const duplicatesRecord: Record<string, string[]> = {}
    for (const [nameKey, versions] of this.duplicates.entries()) {
      if (versions.size > 1) {
        duplicatesRecord[nameKey] = Array.from(versions).sort()
      }
    }

    // 5. Transform nodes map into record
    const nodesRecord: Record<string, DependencyNode> = {}
    for (const [id, node] of this.nodes.entries()) {
      nodesRecord[id] = node
    }

    return {
      nodes: nodesRecord,
      directDependencies: Array.from(this.directDeps).sort(),
      transitiveDependencies: Array.from(this.transitiveDeps).sort(),
      duplicates: duplicatesRecord,
      cycles: this.cycles,
      totalCount: this.nodes.size
    }
  }

  /**
   * Finds the shortest dependency path from a direct root dependency to a target transitive package.
   */
  public findPathToVulnerable(targetName: string, ecosystem: string): {
    directParent: string
    path: string[]
  } | null {
    const targetNorm = targetName.toLowerCase()
    const ecoNorm = ecosystem.toLowerCase()

    // Find any direct dependency matching target
    for (const directId of this.directDeps) {
      const node = this.nodes.get(directId)
      if (node && node.ecosystem.toLowerCase() === ecoNorm && node.name.toLowerCase() === targetNorm) {
        return { directParent: node.name, path: [node.name] }
      }
    }

    // Breadth-first search from all direct dependencies
    for (const directId of this.directDeps) {
      const directNode = this.nodes.get(directId)
      if (!directNode) continue

      const queue: { currentId: string; path: string[] }[] = [
        { currentId: directId, path: [directNode.name] }
      ]
      const visited = new Set<string>([directId])

      while (queue.length > 0) {
        const { currentId, path } = queue.shift()!
        const currentNode = this.nodes.get(currentId)
        if (!currentNode) continue

        for (const childId of currentNode.dependencies) {
          if (visited.has(childId)) continue
          visited.add(childId)

          const childNode = this.nodes.get(childId)
          if (!childNode) continue

          const newPath = [...path, childNode.name]
          if (
            childNode.ecosystem.toLowerCase() === ecoNorm &&
            childNode.name.toLowerCase() === targetNorm
          ) {
            return {
              directParent: directNode.name,
              path: newPath
            }
          }

          if (path.length < 10) {
            // Bound depth to 10 hops
            queue.push({ currentId: childId, path: newPath })
          }
        }
      }
    }

    return null
  }

  /**
   * Cycle detection algorithm using Tarjan / DFS with call stack.
   */
  private detectCycles(): void {
    const visited = new Set<string>()
    const recStack = new Set<string>()

    const dfs = (nodeId: string, currentPath: string[]) => {
      visited.add(nodeId)
      recStack.add(nodeId)
      currentPath.push(nodeId)

      const node = this.nodes.get(nodeId)
      if (node) {
        for (const childId of node.dependencies) {
          if (!visited.has(childId)) {
            dfs(childId, [...currentPath])
          } else if (recStack.has(childId)) {
            // Cycle detected!
            const cycleStartIdx = currentPath.indexOf(childId)
            if (cycleStartIdx !== -1) {
              const cycle = currentPath.slice(cycleStartIdx).concat(childId)
              this.cycles.push(cycle)
            }
          }
        }
      }

      recStack.delete(nodeId)
    }

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId, [])
      }
    }
  }
}
