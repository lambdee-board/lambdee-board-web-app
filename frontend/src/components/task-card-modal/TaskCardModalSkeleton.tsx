import React from 'react'
import {
  Box,
  Card,
  Skeleton,
  Stack,
} from '@mui/material'

const TaskCardModalSkeleton = () => {
  return (
    <Box className='TaskCardModal-wrapper'>
      <Card className='TaskCardModal-paper'>
        <Box className='TaskCardModal-main'>
          <Skeleton height={50} width={200} />
          <Skeleton height={40} width={100} />
          <Card className='TaskCardModal-main-description'>
            <Skeleton height={40} width={100} />
            <Skeleton height={20} width={300} />
            <Skeleton height={20} width={250} />
            <Skeleton height={20} width={150} />
          </Card>
          <Skeleton height={40} width={100} />
          <Card className='TaskCardModal-main-newComment'>
            <Skeleton variant='circular' className='TaskCardModal-avatar' />
            <Skeleton width={200} />
          </Card>
        </Box>
        <Box className='TaskCardModal-sidebar'>
          <Card className='TaskCardModal-sidebar-card'>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Skeleton height={40} width={80} />
                <Box className='TaskCardModal-sidebar-card-box'>
                  <Skeleton variant='circular' height={40} width={40} className='TaskCardModal-avatar' />
                  <div>
                    <Skeleton height={30} width={50} />
                    <Skeleton height={15} width={30} />
                  </div>
                </Box>
              </Stack>

              <Stack spacing={1}>
                <Skeleton height={40} width={80} />
                <Skeleton variant='circular' height={40} width={40} />
              </Stack>

              <Stack spacing={1}>
                <Skeleton height={40} width={80} />
                <Skeleton variant='circular' height={40} width={40} />
              </Stack>

              <Stack spacing={1}>
                <Skeleton height={40} width={80} />
                <Skeleton variant='rectangular' height={24} sx={{ borderRadius: 15 }} />
                <Skeleton variant='rectangular' height={24} sx={{ borderRadius: 15 }} />
                <Skeleton variant='rectangular' height={24} sx={{ borderRadius: 15 }} />
              </Stack>
            </Stack>
          </Card>
        </Box>
      </Card>
    </Box>
  )
}

export default TaskCardModalSkeleton
