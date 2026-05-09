import { ReactNode } from 'react'

import { isDeveloper } from '../../internal/permissions'

interface Props {
  children?: ReactNode
}

export const DeveloperContent = ({ children }: Props) => {
  if (!isDeveloper()) return null

  return (
    <>
      {children}
    </>
  )
}

export default DeveloperContent
