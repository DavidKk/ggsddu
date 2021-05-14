import path from 'path'
import { findProjects } from '../../services/workspace'
import { basePath } from '../../constants/paths'
import * as Types from '../types'

type Options = {
  include?: string[]
  exclude?: string[]
}

/** 获取项目选项 */
const project: Types.ChoicesGenerator = async (options: Options = {}) => {
  const { include = [], exclude = [] } = options
  const projects = await findProjects()
  const filteredProjects = (() => {
    if (Array.isArray(include) && include.length > 0) {
      return projects.filter(({ location }) => {
        return (
          -1 !==
          include.findIndex((pattern) => {
            const abs = path.join(basePath, pattern)
            return abs === location
          })
        )
      })
    }

    return projects.filter(({ location }) => {
      return (
        -1 ===
        exclude.findIndex((pattern) => {
          const abs = path.join(basePath, pattern)
          return abs === location
        })
      )
    })
  })()

  if (!(Array.isArray(filteredProjects) && filteredProjects.length > 0)) {
    return null
  }

  return filteredProjects.map((project) => {
    const { name, description } = project
    return { name: `${name}${description ? ` - ${description}` : ''}`, value: project }
  })
}

export default project
