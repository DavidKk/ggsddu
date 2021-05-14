import React from 'react'
import classnames from 'classnames'
import styles from './styles.module.scss'

interface BarProps {
  width: string
  height: string
  offset: string
  value?: number
  active?: boolean
  locked?: boolean
}

const Bar = React.forwardRef<HTMLDivElement, BarProps>((props, ref) => {
  const { width, height, offset, value, active, locked } = props

  return (
    <div
      className={classnames(styles.bar, {
        [styles.locked]: locked,
        [styles.active]: active,
      })}
      style={{ width, height, left: offset }}
      ref={ref}
    >
      <span className={styles.value}>{value}</span>
    </div>
  )
})

Bar.displayName = 'Bar'
export default Bar
