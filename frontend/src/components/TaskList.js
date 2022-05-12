import React from 'react'
import { List, ListItem, Paper, Toolbar, ListSubheader, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { Box } from '@mui/system'

export default function TaskList(props) {
  return (
    <Box sx={{ m: 2 }}>
      <Toolbar />
      <Paper
        sx={{ width: 240, height: 720, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        elevation={5}>
        <List
          subheader={<ListSubheader>{props.title}</ListSubheader>}>
          {props.children.map((item, index) => (
            <ListItem key={index}>
              {item}
            </ListItem>
          ))}
        </List>
        <Typography>New task</Typography>
      </Paper>
    </Box>
  )
}


TaskList.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
}
