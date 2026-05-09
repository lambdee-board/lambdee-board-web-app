import { parse } from 'ansicolor'

// https://gist.github.com/goldhand/70de06a3bdbdb51565878ad1ee37e92b
const convertStylesStringToObject = (stringStyles: string | undefined): React.CSSProperties =>
  (typeof stringStyles === 'string' ? stringStyles
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

interface Props {
  text: string
}

const AnsiStyledString = ({ text }: Props) => {
  if (text == null) return

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

export default AnsiStyledString
