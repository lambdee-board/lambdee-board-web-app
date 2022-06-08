import PropTypes from 'prop-types'
import { languages, highlight } from 'prismjs/components/prism-core'

import '@fontsource/fira-code'

const CodeHighlighter = ({ code, className }) => {
  return (
    <pre
      className={className}
      style={{ fontFamily: '"Fira code", "Fira Mono", monospace' }}
      dangerouslySetInnerHTML={{ __html: highlight(code, languages.ruby) }}
    />
  )
}

CodeHighlighter.propTypes = {
  code: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default CodeHighlighter
