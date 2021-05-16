import path from 'path'
import { program } from 'commander'
import webpack from 'webpack'
import merge from 'webpack-merge'
import createWebpackConfig from '../webpack/createWebpackConfig'
import { findProjects, graphDependency } from '../services/workspace'
import uiSelectProject from './share/uiSelectProject'
import { warn, fail } from '../services/notify'
import { publicPath as DefaultPublicPath } from '../constants/env'
import { basePath, execPath } from '../constants/paths'

type BuildOptions = {
  publicPath?: string
  packages?: string[]
  include?: string[]
  exclude?: string[]
}

async function build(options: BuildOptions) {
  const { publicPath = DefaultPublicPath, packages, include, exclude } = options
  const createConfig = async (location: string) => {
    const config = await createWebpackConfig({ mode: 'production', location })
    const output = { publicPath }
    return merge(config, { output })
  }

  const configs = await (async () => {
    if (path.relative(basePath, execPath)) {
      const config = await createConfig(execPath)
      return [config]
    }

    const projects = await (async () => {
      if (Array.isArray(packages) && packages.length > 0) {
        const projects = await findProjects()
        const filteredProjects = projects.filter(({ location }) => {
          return (
            -1 !==
            packages.findIndex((pattern) => {
              const abs = path.join(basePath, pattern)
              return abs === location
            })
          )
        })

        return graphDependency(filteredProjects)
      }

      return await uiSelectProject('Please select project to build', true, { include, exclude })
    })()

    if (!(Array.isArray(projects) && projects.length > 0)) {
      return []
    }

    const configs = await Promise.all(
      projects.map(async (project) => {
        const { location: rootPath } = project
        const config = await createConfig(rootPath)
        const output = { publicPath }
        return merge(config, { output })
      })
    )

    return configs
  })()

  if (!(Array.isArray(configs) && configs.length > 0)) {
    warn('No projects selected')
    return
  }

  webpack(configs, (error, stats) => {
    if (error) {
      fail(error)
      return
    }

    const message = stats.toString({ chunks: false, colors: true })
    console.log(message)
  })
}

program
  .command('build')
  .description('Build the marketing tool by webpack')
  .option('--public-path [publicPath]', 'specify public path of webpack output (default use http://[host]:[port])')
  .option('--remote-path [remotePath]', 'specify remote path of webpack module federation (default use public path)')
  .option('--packages <packages...>', 'specify packages of monorepo (default use lerna)')
  .option('--include <include...>', 'specify ignore packages (eg. /bar/foo/*)')
  .option('--exclude <exclude...>', 'specify filter packages')
  .action((options) => build(options))
