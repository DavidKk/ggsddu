import { flattenDeep, uniq, cloneDeep, template } from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import { glob } from 'glob'
import { pkgFile, execPath } from '../constants/paths'
import * as Types from '../types'

export type Project = {
  name: string
  version: string
  description: string
  location: string
  dependencies: string[]
  internalDependencies: string[]
}

export type ProjectGraph = Project & {
  graph?: ProjectGraph[]
}

const pGlob = promisify(glob)

export async function findProjects(workspaces?: string[]): Promise<Project[]> {
  if (typeof workspaces === 'undefined') {
    const source: Types.PackageSource = await fs.readJson(pkgFile)
    const workspaces = Array.isArray(source?.workspaces) ? source?.workspaces : source?.workspaces?.packages || []
    return findProjects(workspaces)
  }

  const projectFolders = await Promise.all(
    workspaces.map(async (workspace) => {
      const dir = path.join(workspace)
      return await pGlob(path.join(execPath, dir))
    })
  )

  const result = await Promise.all(
    flattenDeep(projectFolders).map(async (location) => {
      const pkg = path.join(location, 'package.json')
      if (!(await fs.pathExists(pkg))) {
        return null
      }

      const source: Types.PackageSource = await fs.readJson(pkg)
      const { name, version, description } = source
      const normalDependencies = Object.keys(source.dependencies || {})
      const devDependencies = Object.keys(source.devDependencies || {})
      const peerDependencies = Object.keys(source.peerDependencies || {})
      const optionalDependencies = Object.keys(source.optionalDependencies || {})
      const bundleDependencies = Object.keys(source.bundleDependencies || {})
      const bundledDependencies = Object.keys(source.bundledDependencies || {})
      const dependencies: string[] = uniq([].concat(normalDependencies, devDependencies, peerDependencies, optionalDependencies, bundleDependencies, bundledDependencies))

      return { name, version, description, location, dependencies }
    })
  )

  const projects = result.filter(Boolean)
  const arranged = projects.map((project) => {
    const internalDependencies = project.dependencies.filter((name) => -1 !== projects.findIndex((project) => project.name === name))
    return Object.assign(project, { internalDependencies })
  })

  return arranged
}

export function graphDependency(projects: Project[]): ProjectGraph[] {
  const clonedProjects = cloneDeep(projects)
  const graph = clonedProjects.map((project) => {
    const graph = project.internalDependencies.map((name) => {
      return clonedProjects.find((project) => project.name === name)
    })

    return Object.assign(project, { graph })
  })

  return graph
}

export function stringifyGraph(graph: ProjectGraph[], formatter = '', spaces = 2, shown: string[] = [], messages: string[] = []): string {
  if (Array.isArray(graph) && graph.length > 0) {
    graph.forEach((project) => {
      const { name } = project
      if (-1 !== shown.indexOf(name)) {
        messages.push(`${new Array(spaces).fill(' ').join('')}↳ ...`)
        return
      }

      shown.push(name)
      messages.push(`${new Array(spaces).fill(' ').join('')}↳ ${name}${template(formatter)(project)}`)

      if (Array.isArray(project?.graph) && project.graph.length > 0) {
        stringifyGraph(project.graph, formatter, spaces + 2, shown, messages)
      }

      shown = []
    })
  }

  return messages.join('\n')
}
