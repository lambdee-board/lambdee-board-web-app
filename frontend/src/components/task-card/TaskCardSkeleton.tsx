import React from 'react'
import { Box, Card, Typography, AvatarGroup, Skeleton } from '@mui/material'

const TaskCardSkeleton = () => {
  return (
    <div>
      <Card>
        <Typography>
          <Skeleton height={36} width={200} variant='text' />
        </Typography>
        <Box>
          <Skeleton height={24} width={65} variant='rectangular' />
        </Box>
        <Box>
          <Box />
          <AvatarGroup max={4}>
            <Skeleton height={24} width={24} variant='circular' />
          </AvatarGroup>
        </Box>
      </Card>
    </div>
  )
}

export default TaskCardSkeleton
