import { isProduction } from './env'

/** 提取 css 的文件名 */
export const EXTRACT_CSS_FILENAME = isProduction ? 'css/[name].[hash:8].css' : 'css/[name].css'

/** 提取 css 的 chunk 文件名 */
export const EXTRACT_CSS_CHUNK_NAME = isProduction ? 'css/[id].[hash:8].css' : 'css/[id].css'

/** bundle 文件名 */
export const WEB_JS_FILENAME = isProduction ? 'js/[name].[hash:8].js' : 'js/[name].js'

/** chunk 文件名 */
export const WEB_JS_CHUNK_NAME = isProduction ? 'js/chunk/[name].[hash:8].js' : 'js/chunk/[name].js'

/** 图片名 */
export const IMAGE_NAME = isProduction ? 'img/[name].[hash:8].[ext]' : 'img/[name].[ext]'

/** 媒体名 */
export const MEDIA_NAME = isProduction ? 'media/[name].[hash:8].[ext]' : 'media/[name].[ext]'

/** 字体资源名 */
export const FONT_NAME = isProduction ? 'font/[name].[hash:8].[ext]' : 'font/[name].[ext]'

/** Markdown */
export const MD_NAME = isProduction ? 'mark/[name].[hash:8].[ext]' : 'mark/[name].[ext]'
