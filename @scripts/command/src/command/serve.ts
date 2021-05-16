import path from 'path'
import { program } from 'commander'
import webpack from 'webpack'
import merge from 'webpack-merge'
import WebpackDevServer from 'webpack-dev-server'
import createWebpackConfig from '../webpack/createWebpackConfig'
import { findProjects, graphDependency } from '../services/workspace'
import uiSelectProject from './share/uiSelectProject'
import { warn, fail } from '../services/notify'
import { host as DefaultHost, port as DefaultPort, publicPath as DefaultPublicPath } from '../constants/env'
import { basePath, execPath } from '../constants/paths'
import { Configuration } from 'webpack'

type ServeOptions = {
  port?: number
  host?: string
  publicPath?: string
  packages?: string[]
  include?: string[]
  exclude?: string[]
  local?: boolean
}

const DefaultDevServerOptions: Configuration['devServer'] = {
  disableHostCheck: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000,
  },
}

async function serve(options: ServeOptions = {}) {
  const { host = DefaultHost, port = DefaultPort, publicPath = DefaultPublicPath, packages, include, exclude, local } = options
  const createConfig = async (location: string) => {
    const config = await createWebpackConfig({ mode: 'development', location, extras: { local } })
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

      return await uiSelectProject('Please select project to serve', true, { include, exclude })
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

  const compiler = webpack(configs)
  const devServerConfig = Object.assign({ host, port, hot: true } as Configuration['devServer'], DefaultDevServerOptions)
  const server = new WebpackDevServer(compiler, devServerConfig)
  server.listen(port, host, (error) => {
    if (error) {
      fail(error, true)
      return
    }
  })
}

program
  .command('serve')
  .description('Start the development server by webpack')
  .option('-p, --port [port]', 'specify server port (default use 0.0.0.0)')
  .option('-H, --host [host]', 'specify server host (default use 3000)')
  .option('--public-path [publicPath]', 'specify public path of webpack output (default use http://[host]:[port])')
  .option('--packages <packages...>', 'specify packages of monorepo (default use lerna)')
  .option('--include <include...>', 'specify ignore packages (eg. /bar/foo/*)')
  .option('--exclude <exclude...>', 'specify filter packages')
  .option('--local', 'specify develop mode is local independent')
  .action((options: ServeOptions) => serve(options))
