import { Link, useMatch } from 'react-router-dom'
import { ListItemButton, ListItemText, ListItemIcon } from '@mui/material'
import { ReactElement } from 'react'

interface Props {
  to: string
  end?: boolean
  className?: string
  label: string
  icon: ReactElement
}

export default function SidebarListItem({ to, end, className, label, icon }: Props) {
  const isActive = !!useMatch({ path: to, end: end ?? false })

  return (
    <ListItemButton<typeof Link>
      component={Link}
      to={to}
      className={className}
      selected={isActive}
      divider
    >
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  )
}
