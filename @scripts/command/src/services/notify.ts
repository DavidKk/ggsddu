import chalk, { Color } from 'chalk'
import PrettyError from 'pretty-error'

const isVerbose = -1 !== process.argv.indexOf('--verbose') ? true : false

function pretty(info: string | Error, verbose?: boolean) {
  const reason = info instanceof Error ? info : new Error(info)
  const pe = new PrettyError()
  const prettyMessage = pe.render(reason)
  const message = `${reason.message}${verbose === true ? `\n${prettyMessage}` : ''}`
  return { message, reason, prettyMessage }
}

export function color(info: string | Error, color: typeof Color, verbose = false) {
  const { message } = pretty(info, verbose)
  const content = typeof chalk[color] === 'function' ? chalk[color](message) : message
  console.log(content)
}

export function debug(info: string | Error, verbose = false) {
  if (!isVerbose) {
    return
  }

  const { message } = pretty(info, verbose)
  console.log(chalk.cyan(message))
}

export function success(info: string | Error, verbose = false) {
  const { message } = pretty(info, verbose)
  console.log(chalk.green.bold(`✨ ${message}`))
}

export function info(info: string | Error, verbose = false) {
  const { message } = pretty(info, verbose)
  console.log(chalk.cyan(`${message}`))
}

export function warn(info: string | Error | Error, verbose = false) {
  const { message } = pretty(info, verbose)
  console.log(chalk.yellow.bold(`⚠️ ${message}`))
}

export function fail(info: string | Error | Error, verbose: boolean = isVerbose) {
  const { message } = pretty(info, verbose)
  console.log(chalk.red.bold(`✗ ${message}`))
}

export function randomHex() {
  return `#${((Math.random() * (1 << 24)) | 0).toString(16).toUpperCase().padStart(6, '0')}`
}
