import { Button, IconButton, Paper, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faXmark, faSave, faTrash } from '@fortawesome/free-solid-svg-icons'

import PropTypes from 'prop-types'
import './EditScript.sass'

function EditScript(props) {
  return (
    <div className='EditCard-wrapper'>
      <Paper className='EditCard'>
        <div className='EditCard-content'>
          <Typography className='EditCard-scriptName' variant='h4'>
            {props.name}
          </Typography>
          <Typography className='EditCard-scriptDescription'>
            {props.description}
          </Typography>
        </div>
        <div className='EditCard-actionBtns'>
          <div className='EditCard-closeWrapper'>
            <IconButton onClick={() => console.log('close')} className='EditCard-btnClose'>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>
          <div className='EditCard-scriptBtns'>
            <Button onClick={() => console.log('run')} className='EditCard-btnRun' color='success' startIcon={<FontAwesomeIcon icon={faPlay} />}>
              <Typography>Run</Typography>
            </Button>
            <Button onClick={() => console.log('save')} className='EditCard-btnSave' color='info' startIcon={<FontAwesomeIcon icon={faSave} />}>
              <Typography>Save</Typography>
            </Button>
            <Button onClick={() => console.log('delete')} className='EditCard-btnDelete' color='error' startIcon={<FontAwesomeIcon icon={faTrash} />}>
              <Typography>Delete</Typography>
            </Button>
          </div>

        </div>
      </Paper>
    </div>
  )
}

EditScript.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  closeFn: PropTypes.func.isRequired
}

export default EditScript
