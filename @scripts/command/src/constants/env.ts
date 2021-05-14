import fs from 'fs-extra'
import path from 'path'
import dotenv from 'dotenv'
import { basePath } from './paths'

export const isProduction = process.env.NODE_ENV === 'production'

let host = '0.0.0.0'
let port = 8080
let publicPath = `http://${host}:${port}/`

try {
  const envFile = path.join(basePath, '.env')
  if (fs.pathExistsSync(envFile)) {
    const { HOST, PORT, PUBLIC_PATH } = dotenv.config({ path: envFile }).parsed

    host = HOST || host
    port = parseInt(PORT, 10) || port
    publicPath = PUBLIC_PATH || `http://${host}:${port}/`
  }
} catch (error) {
  // nothing todo...
}

export { host, port, publicPath }
