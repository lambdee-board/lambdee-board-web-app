import { toSvg } from 'jdenticon'

interface Props {
  name: string
  size: number
}

function WorkspaceIcon({ name, size }: Props) {
  const svgString = toSvg(name, size)
  return (
    <div dangerouslySetInnerHTML={{ __html: svgString }}></div>
  )
}

export default WorkspaceIcon
