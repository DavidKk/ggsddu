import React, { useMemo } from 'react'
import { Action } from '@/libs/footprint/types'
import BarVisualizer from './components/BarVisualizer'
import styles from './styles.module.scss'

type VisualizerProps = {
  name?: string
  numbers: number[]
  algorithm?: (numbers: number[]) => Action<number>[]
}

const Visualizer: React.FC<VisualizerProps> = (props) => {
  const { name, algorithm, numbers } = props
  const steps = useMemo(() => algorithm([...numbers]), [numbers])

  return (
    <figure className={styles.container}>
      <div className={styles.visualizer}>
        <BarVisualizer steps={steps} numbers={numbers} />
      </div>
      {name ? <figcaption className={styles.name}>{name}</figcaption> : null}
    </figure>
  )
}

export default Visualizer
