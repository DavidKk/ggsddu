import path from 'path'

export const rootPath = path.join(__dirname, '../../')
export const basePath = path.join(rootPath, '../../')
export const execPath = process.cwd()
export const pkgFile = path.join(execPath, 'package.json')
