import React from 'react'
import { toSvg } from 'jdenticon'


export default function WorkspaceIcon(props) {
  const svgString = toSvg(props.name, props.size)
  return (
    <div dangerouslySetInnerHTML={{ __html: svgString }}></div>
  )
}
