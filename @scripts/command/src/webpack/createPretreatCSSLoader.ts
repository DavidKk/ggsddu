import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import autoprefixer from 'autoprefixer'

import { RuleSetUseItem } from 'webpack'

type CreateOptions = {
  CSSLoaderOptions?: Record<string, any>
}

export default function createPretreatCSSLoader(loaders: RuleSetUseItem[] = [], options: CreateOptions = {}): RuleSetUseItem[] {
  const cssLoaders = [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: Object.assign({ sourceMap: true }, options.CSSLoaderOptions),
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: false,
        postcssOptions: {
          plugins: [autoprefixer({ overrideBrowserslist: ['iOS >= 8', 'Android >= 4.0'] })],
        },
      },
    },
    ...loaders,
  ]

  return cssLoaders.filter(Boolean)
}
