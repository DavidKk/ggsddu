import React, { useCallback, useImperativeHandle, useRef } from 'react'
import classnames from 'classnames'
import asyncAnime from '@/utils/asyncAnime'
import { Colors, Easing } from '../../constants/styles'
import styles from './styles.module.scss'

export interface BarProps {
  width: string
  height: string
  offset: string
  value: number
  options?: {
    duration?: number
  }
}

export interface BarImperativeRef {
  value: BarProps['value']
  idle: () => Promise<void>
  focus: () => Promise<void>
  freeze: () => Promise<void>
  freed: () => Promise<void>
  move: (offset: string) => Promise<void>
}

export interface TransitionColorParams {
  color: string | number
  shadow: string | number
}

export interface TransitionOffsetParams {
  offset?: string
}

const Bar = React.forwardRef<BarImperativeRef, BarProps>((props, ref) => {
  const { width, height, offset, value, options } = props
  const { duration } = options || {}
  const isFreezon = useRef<boolean>(false)
  const masterRef = useRef<HTMLDivElement>()

  const transitionColor = useCallback<(params: TransitionColorParams) => Promise<void>>(
    async (params) => {
      const { color, shadow } = params
      const { current: targets } = masterRef
      const animeParams = { targets, borderColor: color, boxShadow: `0 0 25px ${shadow}`, duration, easing: Easing }
      await asyncAnime(animeParams)
    },
    [duration]
  )

  const transitionOffset = useCallback<(params: TransitionOffsetParams) => Promise<void>>(
    async (params) => {
      const { offset } = params
      const { current: targets } = masterRef
      await asyncAnime({ targets, left: offset, duration, easing: Easing })
    },
    [duration]
  )

  useImperativeHandle(ref, () => ({
    value: value,
    async idle() {
      if (!isFreezon.current) {
        await transitionColor(Colors.idle)
      }
    },
    async focus() {
      if (!isFreezon.current) {
        transitionColor(Colors.focus)
      }
    },
    async freeze() {
      isFreezon.current = true
      await transitionColor(Colors.freeze)
    },
    async freed() {
      isFreezon.current = false
      await transitionColor(Colors.idle)
    },
    move: (offset: string) => transitionOffset({ offset }),
  }))

  return (
    <div className={classnames(styles.bar)} style={{ width, height, left: offset }} ref={masterRef}>
      <span className={styles.value}>{value}</span>
    </div>
  )
})

Bar.displayName = 'Bar'
export default Bar
