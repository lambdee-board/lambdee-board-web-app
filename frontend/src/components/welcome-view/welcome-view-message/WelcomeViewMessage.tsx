import React from 'react'

import { Typography } from '@mui/material'

interface WelcomeViewMessageProps {
  userName: string
}

export default function WelcomeViewMessage({ userName }: WelcomeViewMessageProps) {
  const messages = [
    `Good to see you back, ${userName}!`,
    `Let's get back to work, ${userName}!`,
    `Time to shine, ${userName}!`,
    `You again, ${userName}?`
  ]

  const message = messages[Math.floor(Math.random() * messages.length)]

  return (
    <Typography variant='h4' color='primary'>{message}</Typography>
  )
}
