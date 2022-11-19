export default function textColour(backgroundColor) {
  if (backgroundColor === null || backgroundColor === undefined || typeof(backgroundColor) === 'string' && backgroundColor.length !== 7) return

  const rgb = [backgroundColor.slice(1, 3), backgroundColor.slice(3, 5), backgroundColor.slice(5, 7)]
  const brightness = Math.round(((parseInt(rgb[0]) * 299) +
                    (parseInt(rgb[1]) * 587) +
                    (parseInt(rgb[2]) * 114)) / 1000)

  if (brightness > 125) return '#00052C'

  return '#FFFFFF'
}
