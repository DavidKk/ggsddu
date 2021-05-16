export interface Def<T> {
  type: 'DEFS'
  payload: T[]
}

export interface Idle {
  type: 'IDLE'
}

export interface Compare {
  type: 'COMPARE'
  payload: [number, number]
}

export interface Insert {
  type: 'INSERT'
  payload: { origin: number; target: number }
}

export interface Swap {
  type: 'SWAP'
  payload: [number, number]
}

export interface Mark {
  type: 'MARK'
  payload: number[]
}

export interface Freeze {
  type: 'FREEZE'
  payload: number[]
}

export interface Freed {
  type: 'FREED'
}

export interface End {
  type: 'END'
}

export type Action<T> = Def<T> | Idle | Compare | Insert | Swap | Mark | Freeze | Freed | End
