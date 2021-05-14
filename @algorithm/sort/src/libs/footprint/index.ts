import Footprint from './Footprint'

export default function defs<T>(datas: T[]) {
  const fp = new Footprint<T>()
  const compare: typeof fp.compare = fp.compare.bind(fp)
  const exchange: typeof fp.exchange = fp.exchange.bind(fp)
  const update: typeof fp.update = fp.update.bind(fp)
  const end: typeof fp.end = fp.end.bind(fp)
  const flush: typeof fp.flush = fp.flush.bind(fp)

  fp.defs(datas)
  return { compare, exchange, update, end, flush }
}
