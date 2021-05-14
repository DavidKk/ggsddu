import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import anime from 'animejs'
import Bar from './components/Bar'
import { Steps } from '../../../libs/footprint/types'
import styles from './styles.module.scss'
import barStyles from './components/Bar/styles.module.scss'

type BarVisualizerProps = {
  numbers: number[]
  steps: Steps<number>
  duration?: number
  padding?: number
}

const BarVisualizer: React.FC<BarVisualizerProps> = React.memo(
  (props) => {
    const { numbers, steps, duration, padding } = props
    const barRefs = useRef<HTMLDivElement[]>([])
    const collect = useCallback<(el: HTMLDivElement) => void>((el) => barRefs.current.push(el), [])
    const maxValue = useMemo(() => Math.max(...numbers), [numbers])
    const position = useMemo(() => {
      const widthVolumn = 100 / numbers.length
      const width = `calc(${widthVolumn}% - 10px)`
      return numbers.map((_, index) => {
        /**
         * margin: 0 10px
         * border-width: 1px
         * offset: index * (margin / 4 - border-width * 2) === index * 2.5 - 2 === index * 0.5
         */
        const left = `calc(${index * widthVolumn}% + ${index * (2.5 - 2)}px)`
        return { width, left, index }
      })
    }, [numbers])

    const waterfall = useCallback<(waters: Array<() => Promise<void>>) => Promise<void>>(async (waters) => {
      const [fnc, ...rest] = waters
      await fnc()
      rest.length > 0 && waterfall(rest)
    }, [])

    useEffect(() => {
      const animes = steps.map((step) => {
        switch (step.type) {
          case 'COMPARE':
            return function compare(): Promise<void> {
              return new Promise<void>((resolve) => {
                let times = 0
                const complete = () => ++times === 2 && resolve()

                const [a, b] = step.payload
                const { [a]: aEl } = barRefs.current
                const { [b]: bEl } = barRefs.current

                const styles = { borderColor: '#008f8b', boxShadow: '0 0 25px #33a5a2' }
                anime({ targets: aEl, duration, easing: 'easeInOutCirc', ...styles, complete })
                anime({ targets: bEl, duration, easing: 'easeInOutCirc', ...styles, complete })
              }).then(() => new Promise((resolve) => setTimeout(resolve, padding)))
            }

          case 'EXCHANGE':
            return function swap(): Promise<void> {
              return new Promise<void>((resolve) => {
                let times = 0
                const complete = () => ++times === 2 && resolve()

                const [a, b] = step.payload
                const { [a]: aEl } = barRefs.current
                const { [b]: bEl } = barRefs.current
                const { left: aLeft } = position[a]
                const { left: bLeft } = position[b]

                anime({ targets: aEl, duration, easing: 'easeInOutCirc', left: bLeft, complete })
                anime({ targets: bEl, duration, easing: 'easeInOutCirc', left: aLeft, complete })

                const t = barRefs.current[b]
                barRefs.current[b] = barRefs.current[a]
                barRefs.current[a] = t
              })
            }

          case 'UPDATE':
            return function cooldown(): Promise<void> {
              const styles = { borderColor: '#ff3179', boxShadow: '0 0 25px #c2255c' }
              const promises = barRefs.current.map((el) => new Promise((complete) => anime({ targets: el, duration, ...styles, easing: 'easeInOutCirc', complete })))
              return Promise.all(promises).then(() => new Promise((resolve) => setTimeout(resolve, padding)))
            }
        }
      })

      waterfall(animes.filter(Boolean))
    })

    return (
      <div className={styles.container}>
        {Array.isArray(numbers)
          ? numbers.map((value, index) => {
              const { width, left } = position[index]
              const height = `${(value / maxValue) * 100}%`
              return <Bar width={width} height={height} offset={left} value={value} ref={collect} key={value} />
            })
          : null}
      </div>
    )
  },
  ({ numbers: prev }, { numbers: next }) => {
    return Array.from(new Set([].concat(prev, next))).length === next.length
  }
)

BarVisualizer.displayName = 'BarVisualizer'
BarVisualizer.defaultProps = {
  duration: 260,
  padding: 500,
}

export default BarVisualizer
