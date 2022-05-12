import React from 'react'
import { List, ListItem, Paper, Toolbar, ListSubheader, Typography, IconButton, Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { Box } from '@mui/system'

export default function TaskList(props) {
  return (
    <Box sx={{ m: 2 }}>
      <Toolbar />
      <Paper
        sx={{ width: 320,
          height: 720,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)' }}
        elevation={5}>
        <List sx={{ overflowY: 'scroll' }}
          subheader={<ListSubheader sx={{ pt: 1, pb: 1, fontSize: 24, display: 'flex', justifyContent: 'space-between', background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)' }}>
            <Typography fontSize={24}>
              {props.title}
            </Typography>
            <IconButton aria-label='Edit' color='secondary'>
              <FontAwesomeIcon icon={faPencil} />
            </IconButton>
          </ListSubheader>} >
          {props.children.map((item, index) => (
            <ListItem key={index} sx={{ width: '100%' }} >
              {item}
            </ListItem>
          ))}
        </List>
        <Box>
          <Button sx={{  textTransform: 'none', textAlign: 'left', justifyContent: 'flex-start' }} fullWidth color='secondary' startIcon={<FontAwesomeIcon icon={faPlus} />}>
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
