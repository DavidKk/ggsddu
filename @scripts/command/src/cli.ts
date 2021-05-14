import { program } from 'commander'

import './command/serve'

const argv = ['node', 'gs-cli'].concat(process.argv.slice(2))
program.name('gs-cli').usage('<command> [options]').parse(argv)
