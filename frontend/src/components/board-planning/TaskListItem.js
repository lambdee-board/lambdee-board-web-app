import React, { useRef } from 'react'
import {
  Box,
  Card,
  Typography,
  Avatar,
  AvatarGroup,
  Skeleton,
  Modal
} from '@mui/material'
import PropTypes from 'prop-types'
import PriorityIcon from '../PriorityIcon'

import './TaskListItem.sass'
import TaskCardModal from '../TaskCardModal'
import AvatarPopover from '../AvatarPopover'
import Tag from '../Tag'
import { mutateList } from '../../api/useList'


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


const TaskListItem = (props) => {
  const dndRef = useRef(null)

  const [openTaskCardModal, setOpenTaskCardModal] = React.useState(false)
  const handleOpenTaskCardModal = () => setOpenTaskCardModal(true)
  const handleCloseTaskCardModal = () => {
    mutateList({ id: props.listId, axiosOptions: { params: { tasks: 'all' } } })
    setOpenTaskCardModal(false)
  }
  return (
    <div className='TaskListItem-wrapper' >
      <Modal
        open={openTaskCardModal}
        onClose={handleCloseTaskCardModal}
      >
        <Box
          className='TaskListItem-Modal'
          sx={{  position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0 }}>
          <TaskCardModal taskId={props.id} listId={props.listId} closeModal={handleCloseTaskCardModal} />
        </Box>
      </Modal>
      <div className='TaskListItem' ref={dndRef} onClick={handleOpenTaskCardModal}>
        <Typography variant='caption' sx={{ fontSize: '14px' }} >
          {props.label}
        </Typography>
        <Box className='TaskListItem-properties'>

          <Box className='TaskListItem-properties-tags'>
            <AvatarGroup max={(4)} >
              {props.tags.map((tag) => (
                <Tag name={tag.name} colour={tag.colour} key={tag.id} />
              ))}
            </AvatarGroup>
          </Box>

          <Box className='TaskListItem-properties-priority'>
            <PriorityIcon priority={props.priority} />
            {props.points ? <Avatar className='Box-priority-avatar'>{props.points}</Avatar> : null}
          </Box>
          <Box className='TaskListItem-properties-avatars'>
            <AvatarGroup max={4} className='.MuiAvatar-root'>
              {props.assignedUsers.map((assignedUser) => (
                <AvatarPopover
                  key={assignedUser.id}
                  userName={assignedUser.name}
                  userAvatar={assignedUser.avatarUrl}
                  userTitle={assignedUser.role} />
              ))}
            </AvatarGroup>
          </Box>
        </Box>
      </div>
    </div>
  )
}

TaskListItem.defaultProps = {
  label: '',
  tags: [],
  assignedUsers: [],
}

TaskListItem.propTypes = {
  assignedUsers: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
  pos: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  points: PropTypes.number,
  priority: PropTypes.string,
  tags: PropTypes.array.isRequired,
  listId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
}

export default TaskListItem
