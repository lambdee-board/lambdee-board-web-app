import PropTypes from 'prop-types'
import { languages, highlight } from 'prismjs/components/prism-core'

import '@fontsource/fira-code'

const CodeHighlighter = ({ code, className, plain = false }) => {
  return (
    <pre
      className={className}
      style={{ fontFamily: '"Fira code", "Fira Mono", monospace' }}
      dangerouslySetInnerHTML={{ __html: highlight(code, plain ? languages.plain : languages.ruby) }}
    />
  )
}

CodeHighlighter.propTypes = {
  code: PropTypes.string.isRequired,
  className: PropTypes.string,
  plain: PropTypes.bool,
}

export default CodeHighlighter
