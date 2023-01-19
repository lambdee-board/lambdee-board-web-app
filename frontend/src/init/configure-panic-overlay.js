import panic from 'panic-overlay'

if (process.env.NODE_ENV === 'development') {
  panic.configure({
    projectRoot: __dirname,
    stackEntryClicked(entry) {
      if (!entry.fileRelative.includes('src/')) return
      const relativeFilePath = entry.fileRelative
      const filePath = [__dirname, relativeFilePath].join('/')
      window.open(`vscode://file/${filePath}:${entry.line}:${entry.column}`)
    }
  })
} else {
  panic.configure({ handleErrors: false })
}
