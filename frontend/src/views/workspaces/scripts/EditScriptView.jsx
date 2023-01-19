import * as React from 'react'
import PropTypes from 'prop-types'

import { Avatar, Button,  Paper, Skeleton, Typography } from '@mui/material'
import { faXmark,  faCode, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import useScript from '../../../api/script'


import '@fontsource/fira-code'
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'

import './EditScriptView.sass'
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import ScriptLabel from '../../../components/ScriptLabel'
import UserInfo from '../../../components/task-card-modal/UserInfo'
import useCookie from 'react-use-cookie'
import useUser from '../../../api/user'

const EditScriptSkeleton = () => (
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

const ScriptAuthor = ({ authorId }) => {
  const { data: user, isLoading, isError  } = useUser({ id: authorId })
  if (isLoading || isError) return (<></>)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '12px' }}>
      <Typography sx={{ display: 'flex', alignSelf: 'center', marginRight: '12px', marginLeft: '6px' }}>Author: </Typography>
      <Avatar sx={{ mt: '4px' }}
        alt={user.name} src={user.avatarUrl}
      />
      <UserInfo userName={user.name} userTitle={user.role} />
    </div>
  )
}


const EditScriptView = () => {
  const navigate = useNavigate()
  const { scriptId, workspaceId } = useParams()
  const { data: script, isLoading, isError } = useScript({ id: scriptId })

  const [scriptView, setScriptView] = useCookie('showEditScript', 'code')

  React.useEffect(() => {
    let navigatedOut = false
    if (navigatedOut) return

    if (scriptView === 'code') {
      navigate(`/workspaces/${workspaceId}/scripts/${scriptId}/code`)
    } else {
      navigate(`/workspaces/${workspaceId}/scripts/${scriptId}/triggers`)
    }
    return () => { navigatedOut = true }
  }, [workspaceId, scriptView, scriptId, navigate])


  if (isLoading || isError) return (<EditScriptSkeleton />)

  return (
    <div className='EditCard-wrapper'>
      <Paper className='EditCard'>
        <div className='EditCard-content'>
          <div className='EditCard-header'>
            <div className='EditCard-header-text'>
              <ScriptLabel id={script.id} text={script.name} />
              <ScriptLabel id={script.id} text={script.description} type='description' />
            </div>
            <div className='EditCard-header-author'>
              <div className='EditCard-header-buttons'>
                <Button
                  onClick={() => { if (scriptView !== 'code') setScriptView('code') }}
                  color='secondary'
                  variant={scriptView === 'code' ? 'contained' : 'outlined'}
                  startIcon={<FontAwesomeIcon icon={faCode} />}
                >
                  <Typography>Script</Typography>
                </Button>
                <Button
                  onClick={() => { if (scriptView !== 'triggers') setScriptView('triggers') }}
                  color='secondary'
                  variant={scriptView === 'triggers' ? 'contained' : 'outlined'}
                  startIcon={<FontAwesomeIcon icon={faLink} />}
                >
                  <Typography>Triggers</Typography>
                </Button>
                <Button
                  onClick={() => navigate(`/workspaces/${workspaceId}/scripts/all`)}
                  color='secondary'
                  variant='outlined'
                  startIcon={<FontAwesomeIcon icon={faXmark} />}
                >
                  <Typography>Exit</Typography>
                </Button>
              </div>
              <ScriptAuthor authorId={script?.authorId} />

            </div>
          </div>
          <Outlet />
        </div>
      </Paper>
    </div>
  )
}
ScriptAuthor.propTypes = {
  authorId: PropTypes.number
}

export default EditScriptView
