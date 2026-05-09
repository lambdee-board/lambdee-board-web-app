import { ReactNode } from 'react'

import { isRegular } from '../../internal/permissions'

interface Props {
  children?: ReactNode
}

export const RegularContent = ({ children }: Props) => {
  if (!isRegular()) return null

  return (
    <>
      {children}
    </>
  )
}

export default RegularContent
