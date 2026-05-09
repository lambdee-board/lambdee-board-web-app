import { ReactNode } from 'react'

import { isManager } from '../../internal/permissions'

interface Props {
  children?: ReactNode
}

export const ManagerContent = ({ children }: Props) => {
  if (!isManager()) return null

  return (
    <>
      {children}
    </>
  )
}

export default ManagerContent
