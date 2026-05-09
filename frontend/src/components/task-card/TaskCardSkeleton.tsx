import React from 'react'
import { Box, Card, Typography, AvatarGroup, Skeleton } from '@mui/material'

const TaskCardSkeleton = () => {
  return (
    <div className='TaskCard-wrapper'>
      <Card className='TaskCard'>
        <Typography>
          <Skeleton height={36} width={200} variant='text' />
        </Typography>
        <Box className='Box-categories'>
          <Skeleton height={24} width={65} variant='rectangular' />
        </Box>
        <Box className='Box'>
          <Box className='Box-priority' />
          <AvatarGroup max={4} className='.MuiAvatar-root'>
            <Skeleton height={24} width={24} variant='circular' />
          </AvatarGroup>
        </Box>
      </Card>
    </div>
  )
}

export default TaskCardSkeleton
