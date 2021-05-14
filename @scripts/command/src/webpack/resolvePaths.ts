import path from 'path'

export default function resolvePaths(rootPath: string) {
  const srcPath = path.join(rootPath, './src')
  const distPath = path.join(rootPath, './dist')
  const tempPath = path.join(rootPath, '.temporary')
  return { srcPath, distPath, tempPath }
}
