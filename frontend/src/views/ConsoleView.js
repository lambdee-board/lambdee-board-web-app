import * as React from 'react'

import { LinearProgress } from '@mui/material'
import { languages, highlight } from 'prismjs/components/prism-core'
import Editor from 'react-simple-code-editor'
import { strip } from 'ansicolor'

import '@fontsource/fira-code'
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'

import './ConsoleView.sass'

import dateFormat from 'dateformat'
import CodeHighlighter from '../components/CodeHighlighter'

import WebSocketMessage from '../types/WebSocketMessage'

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
  return document.querySelector('.ConsoleView-editor textarea')
}

const focusCodeEditor = () => getCodeEditor()?.focus()

const ConsoleView = () => {
  const [webSocket, setWebSocket] = React.useState(null)
  const [newInputProvided, setNewInputProvided] = React.useState(false)
  const [consoleHistory, setConsoleHistory] = React.useState([])
  const [consoleInputHistory, setConsoleInputHistory] = React.useState([])
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

  // onMount
  React.useEffect(() => {
    const addToConsoleHistory = (content) => {
      const entry = {
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

    const newWebSocket = new WebSocket(`ws://${process.env.LAMBDEE_HOST}/`)
    newWebSocket.onmessage = async(event) => {
      const message = WebSocketMessage.decode(event.data)
      switch (message.type) {
      case WebSocketMessage.types.consoleOutput:
        addToConsoleHistory(message.payload)
        break
      case WebSocketMessage.types.consoleOutputEnd:
        if (message.payload) addToConsoleHistory(message.payload)
        setResponseReceived(true)
        break
      }
    }
    newWebSocket.onclose = (event) => {
      addToConsoleHistory('Session closed.')
    }
    setWebSocket(newWebSocket)

    // cleanup function
    return () => {
      newWebSocket.close()
    }
  }, [])

  const addToConsoleHistory = (content) => {
    const entry = {
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
    webSocket.send(WebSocketMessage.encode(
      WebSocketMessage.types.consoleInput,
      { input: codeDraft }
    ))

    addToConsoleHistory(codeDraft)
    setCodeDraft('')
    setSelectedHistoryEntry(0)
  }

  const editorOnKeyDown = (e) => {
    const codeEditor = getCodeEditor()
    let newSelectedHistoryEntry, lineBreak

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
      lineBreak = codeEditor.value.indexOf('\n')

      if (lineBreak !== -1 && codeEditor.selectionStart > lineBreak) return
      if (consoleInputHistory.length === 0) return
      if (selectedHistoryEntry - 1 < -consoleInputHistory.length) return

      e.preventDefault()
      newSelectedHistoryEntry = selectedHistoryEntry - 1
      setSelectedHistoryEntry(newSelectedHistoryEntry)
      setCodeDraft(consoleInputHistory.at(newSelectedHistoryEntry)?.content)
      setNewInputProvided(false)
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      break
    case 'ArrowDown':
      if (newInputProvided && codeDraft !== '') return
      lineBreak = codeEditor.value.lastIndexOf('\n')

      if (lineBreak !== -1 && codeEditor.selectionStart <= lineBreak) return
      if (consoleInputHistory.length === 0) return
      if (selectedHistoryEntry + 1 >= 0) {
        e.preventDefault
        setSelectedHistoryEntry(0)
        setCodeDraft('')
        return
      }

      e.preventDefault()
      newSelectedHistoryEntry = selectedHistoryEntry + 1
      setSelectedHistoryEntry(newSelectedHistoryEntry)
      setCodeDraft(consoleInputHistory.at(newSelectedHistoryEntry)?.content)
      setNewInputProvided(false)
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      break
    }
  }

  const updateCode = (val) => {
    setCodeDraft(val)
    if (!newInputProvided) {
      setNewInputProvided(true)
      setSelectedHistoryEntry(0)
    }
  }

  return (
    <div className='ConsoleView'>
      {consoleHistory.map((interaction, index) => (interaction.type === WebSocketMessage.types.consoleOutput ? (
        <div key={index}>
          <CodeHighlighter className='ConsoleView-output' code={strip(interaction.content)} />
        </div>
      ) : (
        <div key={index} className='ConsoleView-prompt-wrapper'>
          <ConsolePrompt />
          <CodeHighlighter className='ConsoleView-editor' code={interaction.content} />
          <div className='ConsoleView-command-time'>
            {dateFormat(interaction.time, 'HH:MM')}
          </div>
        </div>
      )))}
      <div className='ConsoleView-prompt-wrapper'>
        <ConsolePrompt />
        {responseReceived && webSocket && webSocket.readyState !== WebSocket.CLOSED ? (
          <Editor
            className='ConsoleView-editor'
            value={codeDraft}
            onValueChange={updateCode}
            highlight={(code) => highlight(code, languages.ruby)}
            padding={10}
            onKeyDown={editorOnKeyDown}
          />
        ) : (
          <div className='ConsoleView-progress-bar'>
            <LinearProgress color='inherit' />
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsoleView
