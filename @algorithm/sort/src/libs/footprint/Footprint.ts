import * as Types from './types'

export default class Footprint<T> {
  protected steps: Types.Action<T>[]
  protected current: number

  constructor() {
    this.steps = []
    this.current = 0
  }

  public prev() {
    const index = this.current - 1
    const value = this.steps[index]
    if (value) {
      this.current = this.current - 1
      return value
    }

    return null
  }

  public next() {
    const index = this.current + 1
    const value = this.steps[index]
    if (value) {
      this.current = this.current + 1
      return value
    }

    return null
  }

  public defs(data: T[]) {
    const step: Types.Def<T> = { type: 'DEFS', payload: [...data] }
    this.steps.push(step)
    return this
  }

  public idle() {
    const step: Types.Idle = { type: 'IDLE' }
    this.steps.push(step)
    return this
  }

  public compare(aIndex: number, bIndex: number) {
    const step: Types.Compare = { type: 'COMPARE', payload: [aIndex, bIndex] }
    this.steps.push(step)
    return this
  }

  public swap(aIndex: number, bIndex: number) {
    const step: Types.Swap = { type: 'SWAP', payload: [aIndex, bIndex] }
    this.steps.push(step)
    return this
  }

  public insert(origin: number, target: number) {
    const step: Types.Insert = { type: 'INSERT', payload: { origin, target } }
    this.steps.push(step)
    return this
  }

  public mark(indexes: number[]) {
    const step: Types.Mark = { type: 'MARK', payload: indexes }
    this.steps.push(step)
    return this
  }

  public freeze(indexes: number[]) {
    const step: Types.Freeze = { type: 'FREEZE', payload: indexes }
    this.steps.push(step)
    return this
  }

  public freed(indexes: number[]) {
    const step: Types.Freed = { type: 'FREED', payload: indexes }
    this.steps.push(step)
    return this
  }

  public end() {
    const step: Types.End = { type: 'END' }
    this.steps.push(step)
    return this
  }

  public flush() {
    return [...this.steps]
  }

  public clear() {
    return this.steps.splice(0)
  }

  public destroy() {
    this.steps.splice(0)
    this.steps = undefined
    this.current = undefined
  }
}
