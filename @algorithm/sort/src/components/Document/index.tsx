import React from 'react'
import classnames from 'classnames'
import Markdown from '@/components/Markdown'
import styles from './styles.module.scss'

interface DocumentProps {
  view: React.ReactElement
  source: string
}

const Document: React.FC<DocumentProps> = React.memo((props) => {
  const { view, source } = props

  return (
    <div className={styles.container}>
      <div className={styles.view}>{view}</div>
      <div className={classnames('hljs', styles.document)}>{source ? <Markdown source={source} /> : null}</div>
    </div>
  )
})

Document.displayName = 'Document'
export default Document
