import { program } from 'commander'

import './command/serve'
import './command/build'

const argv = ['node', 'gs-cli'].concat(process.argv.slice(2))
program.name('gs-cli').usage('<command> [options]').parse(argv)
