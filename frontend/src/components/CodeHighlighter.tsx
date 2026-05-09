import { languages, highlight } from 'prismjs/components/prism-core'

import '@fontsource/fira-code'

interface Props {
  code: string
  className?: string
  plain?: boolean
}

const CodeHighlighter = ({ code, className, plain = false }: Props) => {
  return (
    <pre
      className={className}
      style={{ fontFamily: '"Fira code", "Fira Mono", monospace' }}
      dangerouslySetInnerHTML={{ __html: highlight(code, plain ? languages.plain : languages.ruby) }}
    />
  )
}

export default CodeHighlighter
