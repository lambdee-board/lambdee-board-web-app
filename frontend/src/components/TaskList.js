import React from 'react'
import { List, ListItem, Paper, Toolbar, InputBase, Card, ListSubheader, Typography, IconButton, Button } from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import apiClient from '../api/apiClient'

import './TaskList.sass'

const postTest = () => {

}


export default function TaskList(props) {
  const [visible, setVisible] = React.useState(true)
  return (
    <Box className='TaskList-wrapper'>
      <Toolbar />
      <Paper className='TaskList-paper'
        elevation={5}>
        <List className='TaskList'
          subheader={<ListSubheader className='TaskList-header' >
            <Typography className='TaskList-header-text' >
              {props.title}
            </Typography>
            <IconButton aria-label='Edit' color='secondary'>
              <FontAwesomeIcon icon={faPencil} />
            </IconButton>
          </ListSubheader>} >
          {props.children.map((item, index) => (
            <ListItem className='TaskList-item' key={index} >
              {item}
            </ListItem>
          ))}
          {!visible &&
          <Card className='TaskList-new-task'>
            <InputBase
              className='TaskList-new-task-input'
              fullWidth
              multiline
              placeholder='Task Label'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  apiClient.post('/api/tasks', { name: 'New Task' })
                  setVisible(!visible)
                }
              }}
            />
            <IconButton className='TaskList-new-task-cancel' onClick={() => setVisible(!visible)}>
              <FontAwesomeIcon className='TaskList-new-task-cancel-icon' icon={faTrash} />
            </IconButton>
          </Card>
          }
        </List>
        <Box className='TaskList-new-task-wrapper'>
          {visible &&
            <Button onClick={() => setVisible(!visible)} className='TaskList-new-task-button' color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
              <Typography>New Task</Typography>
            </Button>
          }
        </Box>
      </Paper>
    </Box>
  )
}


TaskList.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
}
