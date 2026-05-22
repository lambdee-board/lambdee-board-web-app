import * as React from 'react'

import { Avatar, Box, Button, Paper, Typography } from '@mui/material'
import { faXmark, faCode, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useScript from '../../../../api/script'

import '@fontsource/fira-code'
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'


import { useNavigate, useParams, Outlet } from 'react-router-dom'
import ScriptLabel from '../../../../components/script-label/ScriptLabel'
import UserInfo from '../../../../components/task-card-modal/UserInfo'
import useCookie from 'react-use-cookie'
import useUser from '../../../../api/user'
import EditScriptViewSkeleton from './EditScriptViewSkeleton'

interface ScriptAuthorProps {
  authorId?: number
}

const ScriptAuthor = ({ authorId }: ScriptAuthorProps) => {
  const { data: user, isLoading, isError  } = useUser({ id: authorId })
  if (isLoading || isError) return (<></>)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1.5 }}>
      <Typography sx={{ display: 'flex', alignSelf: 'center', mr: 1.5, ml: 0.75 }}>Author: </Typography>
      <Avatar sx={{ mt: 0.5 }}
        alt={user.name} src={user.avatarUrl}
      />
      <UserInfo userName={user.name} userTitle={user.role} />
    </Box>
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

  if (isLoading || isError) return (<EditScriptViewSkeleton />)

  return (
    <div style={{ position: 'absolute', width: 'calc(100vw - 280px)', minHeight: 'calc(100vh - 104px)', padding: 16 }}>
      <Paper sx={{ minHeight: 'calc(100vh - 104px)', background: 'linear-gradient(222.65deg, #EFF7FA -19.21%, #EDF1F9 119.83%)', borderRadius: '8px', p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', minWidth: '1000px', width: 'calc(100% - 24px)' }}>
        <div style={{ width: '100%', minWidth: '1000px' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '600px' }}>
              <ScriptLabel id={script.id} text={script.name} />
              <ScriptLabel id={script.id} text={script.description} type='description' />
            </div>
            <div style={{ justifySelf: 'flex-end', marginLeft: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1.5, gap: 0.5 }}>
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
              </Box>
              <ScriptAuthor authorId={script?.authorId} />
            </div>
          </div>
          <Outlet />
        </div>
      </Paper>
    </div>
  )
}

export default EditScriptView
