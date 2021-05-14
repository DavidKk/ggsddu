import * as Types from './types'

export default class Footprint<T> {
  protected steps: Types.Steps<T>
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
    const step: Types.DefStep<T> = { type: 'DEFS', payload: [...data] }
    this.steps.push(step)
    return this
  }

  public compare(aIndex: number, bIndex: number) {
    const step: Types.CompareStep = { type: 'COMPARE', payload: [aIndex, bIndex] }
    this.steps.push(step)
    return this
  }

  public exchange(aIndex: number, bIndex: number) {
    const step: Types.ExchangeStep = { type: 'EXCHANGE', payload: [aIndex, bIndex] }
    this.steps.push(step)
    return this
  }

  public update(data: T[]) {
    const step: Types.UpdateStep<T> = { type: 'UPDATE', payload: [...data] }
    this.steps.push(step)
    return this
  }

  public end() {
    const step: Types.EndStep = { type: 'END' }
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
