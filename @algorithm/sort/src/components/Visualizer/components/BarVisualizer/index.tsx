import React, { Fragment, useCallback, useEffect, useMemo, useRef, MutableRefObject } from 'react'
import { Action } from '@/libs/footprint/types'
import Bar, { BarImperativeRef } from './components/Bar'
import Slider, { SliderImperativeRef } from './components/Slider'
import styles from './styles.module.scss'

type BarVisualizerProps = {
  numbers: number[]
  steps: Action<number>[]
  duration?: number
  interval?: number
}

function collectRef(refs: MutableRefObject<BarImperativeRef[]>): (scope: BarImperativeRef) => Promise<void>
function collectRef(refs: MutableRefObject<SliderImperativeRef[]>): (scope: SliderImperativeRef) => Promise<void>
function collectRef(refs: MutableRefObject<any>) {
  return (scope: any) => refs.current.push(scope)
}

const BarVisualizer: React.FC<BarVisualizerProps> = React.memo(
  (props) => {
    const { numbers, steps, duration, interval } = props
    const barRefs = useRef<BarImperativeRef[]>([])
    const sliderRefs = useRef<SliderImperativeRef[]>([])
    const collectImperativeRef = useCallback(collectRef, [])

    const maxValue = useMemo(() => Math.max(...numbers), [numbers])
    const position = useMemo(() => {
      const widthVolumn = 100 / numbers.length
      const width = `calc(${widthVolumn}% - var(--gutter-size))`
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

    const waterfall = useCallback<(waters: Array<() => Promise<void>>) => Promise<void>>(
      async (waters) => {
        if (Array.isArray(waters) && waters.length > 0) {
          const [fnc, ...rest] = waters
          await fnc()
          rest.length > 0 && setTimeout(() => waterfall(rest), interval)
        }
      },
      [interval]
    )

    useEffect(() => {
      const animes = steps.map((step) => {
        switch (step.type) {
          case 'IDLE': {
            return async function idle(): Promise<void> {
              const { current: barScopes } = barRefs
              const { current: sliderScopes } = sliderRefs
              await Promise.all([...barScopes, ...sliderScopes].map((scope) => scope.idle()))
            }
          }

          case 'COMPARE': {
            return async function compare(): Promise<void> {
              const [a, b] = step.payload
              const { [a]: aBarScope, [b]: bBarScope } = barRefs.current
              const { [a]: aSliderScope, [b]: bSlideRScope } = sliderRefs.current
              await Promise.all([aBarScope, bBarScope, aSliderScope, bSlideRScope].map((scope) => scope.focus()))
            }
          }

          case 'INSERT': {
            return async function insert(): Promise<void> {
              const { origin, target } = step.payload
              const { current: scopes } = barRefs

              const scope = scopes.splice(origin, 1)[0]
              scopes.splice(origin > target ? target : target - 1, 0, scope)

              await Promise.all(
                scopes.map((scope, index) => {
                  const { left } = position[index]
                  return scope.move(left)
                })
              )
            }
          }

          case 'SWAP': {
            return async function swap(): Promise<void> {
              const [a, b] = step.payload

              const { current: scopes } = barRefs
              const { [a]: aScope } = scopes
              const { [b]: bScope } = scopes

              const { left: aLeft } = position[a]
              const { left: bLeft } = position[b]
              await Promise.all([aScope.move(bLeft), bScope.move(aLeft)])

              const t = scopes[b]
              scopes[b] = scopes[a]
              scopes[a] = t
            }
          }

          case 'MARK': {
            return async function mark(): Promise<void> {
              const { current: scopes } = barRefs
              const indexes = step.payload
              await Promise.all(indexes.map((index) => scopes[index].freeze()))
            }
          }

          case 'FREEZE': {
            return async function freeze(): Promise<void> {
              const { current: scopes } = sliderRefs
              const indexes = step.payload
              await Promise.all(indexes.map((index) => scopes[index].freeze()))
            }
          }

          case 'FREED': {
            return async function freed(): Promise<void> {
              const { current: scopes } = sliderRefs
              const indexes = step.payload
              await Promise.all(indexes.map((index) => scopes[index].freed()))
            }
          }

          case 'END': {
            return async function end(): Promise<void> {
              const { current: barScopes } = barRefs
              const { current: sliderScopes } = sliderRefs
              await Promise.all([...barScopes, ...sliderScopes].map((scope) => scope.freeze()))
            }
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
              const height = `calc(${(value / maxValue) * 100}% - 30px - 10px - 2px)`
              return (
                <Fragment key={`${value}-${index}`}>
                  <Bar width={width} height={height} offset={left} value={value} options={{ duration }} ref={collectImperativeRef(barRefs)} />
                  <Slider width={width} offset={left} options={{ duration }} ref={collectImperativeRef(sliderRefs)} />
                </Fragment>
              )
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
  interval: 500,
}

export default BarVisualizer
