import * as React from 'react'

import { Box, LinearProgress } from '@mui/material'
import { languages, highlight } from 'prismjs/components/prism-core'
import Editor from 'react-simple-code-editor'
import { strip } from 'ansicolor'

import '@fontsource/fira-code'
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'


import dateFormat from 'dateformat'
import CodeHighlighter from '../../components/CodeHighlighter'

import WebSocketMessage from '../../internal/web-socket-message'

const HISTORY_BUFFER_SIZE = 200
const INPUT_HISTORY_BUFFER_SIZE = HISTORY_BUFFER_SIZE / 2

const ConsolePrompt = () => {
  return (
    <pre style={{ marginTop: 18.4, marginBottom: 18.4 }}>
      {'>>>'}
    </pre>
  )
}

const scrollToBottom = () => {
  const view = document.querySelector('.ConsoleView')
  if (!view) return
  view.scrollTop = view.scrollHeight
}

const getCodeEditor = () => {
  return document.querySelector<HTMLTextAreaElement>('.ConsoleView-editor textarea')
}

const focusCodeEditor = () => getCodeEditor()?.focus()

interface HistoryEntry {
  type: string
  content: string
  time: Date
}

const ConsoleView = () => {
  const [webSocketOpen, setWebSocketOpen] = React.useState(false)
  const [webSocket, setWebSocket] = React.useState<WebSocket | null>(null)
  const [newInputProvided, setNewInputProvided] = React.useState(false)
  const [consoleHistory, setConsoleHistory] = React.useState<HistoryEntry[]>([])
  const [consoleInputHistory, setConsoleInputHistory] = React.useState<HistoryEntry[]>([])
  const [responseReceived, setResponseReceived] = React.useState(false)
  const [selectedHistoryEntry, setSelectedHistoryEntry] = React.useState(0)
  const [codeDraft, setCodeDraft] = React.useState(`class Ruby
  def initialize
    @is = :cool
  end

  attr_reader :is
end

ruby = Ruby.new
puts ruby`)

  React.useEffect(() => {
    const addToConsoleHistory = (content: string) => {
      const entry: HistoryEntry = {
        type: WebSocketMessage.types.consoleOutput,
        content,
        time: new Date(),
      }
      setConsoleHistory((oldConsoleHistory) => [...oldConsoleHistory.slice(-HISTORY_BUFFER_SIZE), entry])
      setTimeout(() => {
        scrollToBottom()
        focusCodeEditor()
      }, 50)
    }

    const newWebSocket = new WebSocket(`${process.env.SCRIPT_SERVICE_WS_PROTOCOL}://${process.env.SCRIPT_SERVICE_EXTERNAL_HOST}`)
    newWebSocket.onmessage = async (event) => {
      const message = WebSocketMessage.decode(event.data)
      switch (message.type) {
      case WebSocketMessage.types.consoleOutput:
        addToConsoleHistory(message.payload as string)
        break
      case WebSocketMessage.types.info:
        addToConsoleHistory(message.payload as string)
        setResponseReceived(true)
        break
      case WebSocketMessage.types.consoleOutputEnd:
        if (message.payload) addToConsoleHistory(message.payload as string)
        setResponseReceived(true)
        break
      }
    }
    newWebSocket.onclose = () => {
      addToConsoleHistory('Session closed.')
    }
    newWebSocket.onopen = () => {
      setWebSocketOpen(true)
      newWebSocket.send(WebSocketMessage.encode(
        WebSocketMessage.types.auth,
        { token: localStorage.getItem('token') }
      ))
    }
    setWebSocket(newWebSocket)

    return () => {
      newWebSocket.close()
    }
  }, [])

  const addToConsoleHistory = (content: string) => {
    const entry: HistoryEntry = {
      type: WebSocketMessage.types.consoleInput,
      content,
      time: new Date(),
    }
    setConsoleHistory((oldConsoleHistory) => [...oldConsoleHistory.slice(-HISTORY_BUFFER_SIZE), entry])
    setConsoleInputHistory((old) => [...old.slice(-INPUT_HISTORY_BUFFER_SIZE), entry])
    setResponseReceived(false)
    setTimeout(() => {
      scrollToBottom()
    }, 50)
  }

  const sendCode = () => {
    webSocket!.send(WebSocketMessage.encode(
      WebSocketMessage.types.consoleInput,
      { input: codeDraft }
    ))

    addToConsoleHistory(codeDraft)
    setCodeDraft('')
    setSelectedHistoryEntry(0)
  }

  const editorOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const codeEditor = getCodeEditor()
    let newSelectedHistoryEntry: number, lineBreak: number

    switch (e.key) {
    case 'Enter':
      if (e.shiftKey === true) {
        scrollToBottom()
        return
      }
      e.preventDefault()
      sendCode()
      break
    case 'ArrowUp':
      if (newInputProvided && codeDraft !== '') return
      lineBreak = codeEditor!.value.indexOf('\n')

      if (lineBreak !== -1 && codeEditor!.selectionStart > lineBreak) return
      if (consoleInputHistory.length === 0) return
      if (selectedHistoryEntry - 1 < -consoleInputHistory.length) return

      e.preventDefault()
      newSelectedHistoryEntry = selectedHistoryEntry - 1
      setSelectedHistoryEntry(newSelectedHistoryEntry)
      setCodeDraft(consoleInputHistory.at(newSelectedHistoryEntry)?.content ?? '')
      setNewInputProvided(false)
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      break
    case 'ArrowDown':
      if (newInputProvided && codeDraft !== '') return
      lineBreak = codeEditor!.value.lastIndexOf('\n')

      if (lineBreak !== -1 && codeEditor!.selectionStart <= lineBreak) return
      if (consoleInputHistory.length === 0) return
      if (selectedHistoryEntry + 1 >= 0) {
        setSelectedHistoryEntry(0)
        setCodeDraft('')
        return
      }

      e.preventDefault()
      newSelectedHistoryEntry = selectedHistoryEntry + 1
      setSelectedHistoryEntry(newSelectedHistoryEntry)
      setCodeDraft(consoleInputHistory.at(newSelectedHistoryEntry)?.content ?? '')
      setNewInputProvided(false)
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      break
    }
  }

  const updateCode = (val: string) => {
    setCodeDraft(val)
    if (!newInputProvided) {
      setNewInputProvided(true)
      setSelectedHistoryEntry(0)
    }
  }

  return (
    <div style={{ overflowY: 'scroll', overflowX: 'scroll', fontFamily: '"Fira code", "Fira Mono", monospace', backgroundColor: '#032b3a', width: '100vw', height: 'calc(100vh - 64px)', color: '#fff' }}>
      {consoleHistory.map((interaction, index) => (interaction.type === WebSocketMessage.types.consoleOutput ? (
        <Box key={index} sx={{ my: 0, mx: 1 }}>
          <CodeHighlighter code={strip(interaction.content)} />
        </Box>
      ) : (
        <Box key={index} sx={{ px: 1, display: 'flex', flexWrap: 'nowrap', flexDirection: 'row', alignContent: 'flex-start', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <ConsolePrompt />
          <Box sx={{ width: '100%', borderRadius: '8px', m: 1 }}>
            <CodeHighlighter code={interaction.content} />
          </Box>
          <Box sx={{ m: 2.25 }}>
            {dateFormat(interaction.time, 'HH:MM')}
          </Box>
        </Box>
      )))}
      <Box sx={{ px: 1, display: 'flex', flexWrap: 'nowrap', flexDirection: 'row', alignContent: 'flex-start', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <ConsolePrompt />
        {responseReceived && webSocket && webSocket.readyState !== WebSocket.CLOSED ? (
          <Editor
            style={{ width: '100%', borderRadius: '8px', margin: 8, fontFamily: '"Fira code", "Fira Mono", monospace' }}
            value={codeDraft}
            onValueChange={updateCode}
            highlight={(code) => highlight(code, languages.ruby)}
            padding={10}
            onKeyDown={editorOnKeyDown as any}
          />
        ) : (
          <Box sx={{ ml: 2.25, width: '80px' }}>
            <LinearProgress color='inherit' />
          </Box>
        )}
      </Box>
    </div>
  )
}

export default ConsoleView
