import React, { useMemo } from 'react'
import classnames from 'classnames'
import marked from 'marked'
import highlight from 'highlight.js'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-sublime.css'
import styles from './styles.module.scss'

highlight.registerLanguage('typescript', typescript)
highlight.registerLanguage('javascript', javascript)
highlight.registerLanguage('ts', typescript)
highlight.registerLanguage('js', javascript)

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight(code) {
    const result = highlight.highlightAuto(code)
    return result.value
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
})

interface MarkdownProps {
  type?: 'code' | 'html'
  source: string
}

const Markdown: React.FC<MarkdownProps> = React.memo((props) => {
  const { type, source } = props
  const content = useMemo(() => {
    if (typeof source === 'string') {
      const content = source.replace(/(^[\s\b]|[\s\b]$)/g, '')
      return marked(content)
    }

    return source
  }, [source])

  if (type === 'html') {
    return <div className={classnames('hljs', styles.container)} dangerouslySetInnerHTML={{ __html: source }} />
  }

  return <div className={classnames('hljs', styles.container)} dangerouslySetInnerHTML={{ __html: content }} />
})

Markdown.defaultProps = {
  type: 'code',
}

Markdown.displayName = 'Markdown'
export default Markdown
