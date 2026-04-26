import React from 'react'
import { Paper, Skeleton } from '@mui/material'

const EditScriptViewSkeleton = () => (
  <div className='EditCard-wrapper'>
    <Paper className='EditCard'>
      <div className='EditCard-content'>
        <div className='EditCard-header'>
          <Skeleton variant='rectangular' width={480} height={40} sx={{ mb: '8px' }} />
          <Skeleton variant='rectangular' width={210} height={32} sx={{ mb: '8px' }} />
        </div>
      </div>
    </Paper>
  </div>
)

export default EditScriptViewSkeleton
