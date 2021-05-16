import Footprint from './Footprint'

export default function defs<T>(datas: T[]) {
  const fp = new Footprint<T>()
  const idle: typeof fp.idle = fp.idle.bind(fp)
  const compare: typeof fp.compare = fp.compare.bind(fp)
  const swap: typeof fp.swap = fp.swap.bind(fp)
  const insert: typeof fp.insert = fp.insert.bind(fp)
  const mark: typeof fp.mark = fp.mark.bind(fp)
  const freeze: typeof fp.freeze = fp.freeze.bind(fp)
  const freed: typeof fp.freed = fp.freed.bind(fp)
  const end: typeof fp.end = fp.end.bind(fp)
  const flush: typeof fp.flush = fp.flush.bind(fp)

  fp.defs(datas)
  return { idle, compare, insert, swap, mark, freeze, freed, end, flush }
}
