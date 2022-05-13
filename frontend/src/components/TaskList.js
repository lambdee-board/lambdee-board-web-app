import React from 'react'
import { List, ListItem, Paper, Toolbar, ListSubheader, Typography, IconButton, Button } from '@mui/material'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

import './TaskList.sass'


export default function TaskList(props) {
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
        </List>
        <Box className='TaskList-new-task-wrapper'>
          <Button className='TaskList-new-task-button' color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
            <Typography>New task</Typography>
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}


TaskList.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
}
