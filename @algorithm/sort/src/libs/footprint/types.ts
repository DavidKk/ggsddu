export interface DefStep<T> {
  type: 'DEFS'
  payload: T[]
}

export interface CompareStep {
  type: 'COMPARE'
  payload: [number, number]
}

export interface ExchangeStep {
  type: 'EXCHANGE'
  payload: [number, number]
}

export interface UpdateStep<T> {
  type: 'UPDATE'
  payload: T[]
}

export interface EndStep {
  type: 'END'
}

export type Steps<T> = Array<DefStep<T> | CompareStep | ExchangeStep | UpdateStep<T> | EndStep>
