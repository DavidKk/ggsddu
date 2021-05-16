import React, { useCallback, useImperativeHandle, useRef } from 'react'
import { Colors, Easing } from '../../constants/styles'
import asyncAnime from '../../../../../utils/asyncAnime'
import styles from './styles.module.scss'

export interface SliderProps {
  width: string
  offset: string
  options?: {
    duration?: number
  }
}

export interface SliderImperativeRef {
  idle: () => Promise<void>
  focus: () => Promise<void>
  freeze: () => Promise<void>
  freed: () => Promise<void>
}

export interface TransitionColorParams {
  color: string | number
  shadow: string | number
}

const Slider = React.forwardRef<SliderImperativeRef, SliderProps>((props, ref) => {
  const { width, offset, options } = props
  const { duration } = options || {}
  const isFreezon = useRef<boolean>(false)
  const masterRef = useRef<HTMLDivElement>()

  const transitionColor = useCallback<(params: TransitionColorParams) => Promise<void>>(
    async (params) => {
      const { color, shadow } = params
      const { current: targets } = masterRef
      const animeParams = { targets, borderColor: color, backgroundColor: color, boxShadow: `0 0 25px ${shadow}`, duration, easing: Easing }
      await asyncAnime(animeParams)
    },
    [duration]
  )

  useImperativeHandle(ref, () => ({
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
  }))

  return <div className={styles.slider} ref={masterRef} style={{ width, left: offset }} />
})

Slider.displayName = 'Slider'
export default Slider
