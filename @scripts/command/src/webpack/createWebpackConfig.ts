import { upperFirst, camelCase, startCase } from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import { WatchIgnorePlugin, HotModuleReplacementPlugin } from 'webpack'
import merge from 'webpack-merge'
import WebpackBar from 'webpackbar'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import resolvePaths from './resolvePaths'
import createPretreatCSSLoader from './createPretreatCSSLoader'
import * as FILES from '../constants/file'

import { Configuration, RuleSetRule, ProgressPlugin } from 'webpack'
import { PackageSource } from '../types'

type CreateParams = {
  mode: 'development' | 'production'
  location: string
  extras?: {
    development?: Configuration
    production?: Configuration
    local?: boolean
  }
}

export default async function createWebpackConfig(params: CreateParams) {
  const { mode, location, extras = {} } = params
  const { local: isIndependentDevelop } = extras
  const { srcPath } = resolvePaths(location)
  const pkgFile = path.join(location, 'package.json')
  const pkgJSON: PackageSource = await fs.readJSON(pkgFile)
  const { name, description } = pkgJSON || {}
  const shortName = path.basename(name)
  const alias = upperFirst(camelCase(shortName))

  const Rules: RuleSetRule[] = [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
    },
    {
      test: /\.css/,
      exclude: [/\.module\.css/],
      use: createPretreatCSSLoader(),
    },
    {
      test: /\.scss/,
      exclude: [/\.module\.scss/],
      use: createPretreatCSSLoader([
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ]),
    },
    {
      test: /\.module\.css/,
      include: [/\.module\.css/],
      use: createPretreatCSSLoader([], {
        CSSLoaderOptions: {
          modules: true,
          importLoaders: 1,
        },
      }),
    },
    {
      test: /\.module\.scss/,
      include: [/\.module\.scss/],
      use: createPretreatCSSLoader(
        [
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        {
          CSSLoaderOptions: {
            sourceMap: false,
            importLoaders: 1,
            modules: true,
          },
        }
      ),
    },
    {
      test: /\.(png|jpe?g|gif)(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          options: { limit: 1024, name: path.join(shortName, FILES.IMAGE_NAME) },
        },
      ],
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          options: { limit: 1024, name: path.join(shortName, FILES.MEDIA_NAME) },
        },
      ],
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          options: { limit: 1024, name: path.join(shortName, FILES.FONT_NAME) },
        },
      ],
    },
  ]

  const progressName = `${startCase(shortName)}${description ? ` - ${description}` : ''}`
  const Plugins: ProgressPlugin[] = [
    new WebpackBar({
      name: progressName,
    }),
    new WatchIgnorePlugin({
      paths: [/\.d\.ts$/],
    }),
    new MiniCssExtractPlugin({
      filename: path.join(shortName, FILES.EXTRACT_CSS_FILENAME),
      ignoreOrder: true,
      chunkFilename: path.join(shortName, FILES.EXTRACT_CSS_CHUNK_NAME),
    }),
  ]

  const Config: Configuration = {
    name: alias,
    entry: path.join(srcPath, isIndependentDevelop ? 'index.local' : 'index'),
    output: {
      filename: path.join(shortName, FILES.WEB_JS_FILENAME),
      chunkFilename: path.join(shortName, FILES.WEB_JS_CHUNK_NAME),
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.join(srcPath, 'tsconfig.json'),
        }),
      ],
    },
    module: {
      rules: [...Rules],
    },
    plugins: [...Plugins],
  }

  if (mode === 'development') {
    const { development = {} } = extras
    const plugins = [
      new HtmlWebpackPlugin({
        filename: `${shortName}.html`,
        template: path.join(srcPath, 'index.html'),
        inject: 'body',
        minify: true,
      }),
      new HotModuleReplacementPlugin(),
    ]

    const config: Configuration = {
      stats: 'errors-only',
      mode: 'development',
      devtool: 'source-map',
      plugins: plugins.filter(Boolean),
    }

    return merge(Config, config, development)
  }

  if (mode === 'production') {
    const { production = {} } = extras
    const plugins = [
      new HtmlWebpackPlugin({
        filename: `${shortName}.html`,
        template: path.join(srcPath, 'index.html'),
        inject: 'body',
        minify: true,
      }),
    ]

    const config: Configuration = {
      stats: 'normal',
      mode: 'production',
      optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            extractComments: false,
          }),
        ],
      },
      plugins: plugins.filter(Boolean),
    }

    return merge(Config, config, production)
  }
}
