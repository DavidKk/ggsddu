import React, { useMemo } from 'react'
import BarVisualizer from './components/BarVisualizer'
import { Steps } from '../libs/footprint/types'
import styles from './styles.module.scss'

type VisualizerProps = {
  numbers: number[]
  algorithm?: (numbers: number[]) => Steps<number>
}

const Visualizer: React.FC<VisualizerProps> = (props) => {
  const { algorithm, numbers } = props
  const steps = useMemo(() => algorithm([...numbers]), [numbers])

  return (
    <div className={styles.containers}>
      <BarVisualizer steps={steps} numbers={numbers} />
    </div>
  )
}

export default Visualizer
