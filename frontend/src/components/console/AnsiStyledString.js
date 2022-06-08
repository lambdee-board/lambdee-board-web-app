import { parse } from 'ansicolor'
import PropTypes from 'prop-types'

// https://gist.github.com/goldhand/70de06a3bdbdb51565878ad1ee37e92b
const convertStylesStringToObject = (stringStyles) => (typeof stringStyles === 'string' ? stringStyles
  .split(';')
  .reduce((acc, style) => {
    const colonPosition = style.indexOf(':')

    if (colonPosition === -1) return acc

    const
      camelCaseProperty = style
        .substring(0, colonPosition)
        .trim()
        .replace(/^-ms-/, 'ms-')
        .replace(/-./g, (c) => c.substring(1).toUpperCase()),
      value = style.substring(colonPosition + 1).trim()

    return value ? { ...acc, [camelCaseProperty]: value } : acc
  }, {}) : {})

const AnsiStyledString = ({ text }) => {
  const parsedSpans = [...parse(text).spans]

  return (
    <pre>
      {parsedSpans.map((fragment, index) => {
        return (<span key={index} style={{ ...convertStylesStringToObject(fragment.css) }}>
          {fragment.text}
        </span>)
      })}
    </pre>
  )
}

AnsiStyledString.propTypes = {
  text: PropTypes.string.isRequired
}

export default AnsiStyledString
