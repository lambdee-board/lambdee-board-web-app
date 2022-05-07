import panic from 'panic-overlay'
import erbSourceFiles from 'erb-compilation/erb-source-files'
import { get } from 'lodash'

const isAnErbFile = (relativeFilePath) => {
  const filePathArray = relativeFilePath.split(process.path.sep)
  return get(erbSourceFiles, filePathArray.splice(1))
}

if (process.env.NODE_ENV === 'development') {
  panic.configure({
    projectRoot: __dirname,
    stackEntryClicked(entry) {
      if (!entry.fileRelative.includes(`build${process.path.sep}`) && !entry.fileRelative.includes(`src${process.path.sep}`)) return

      let relativeFilePath = entry.fileRelative.replace('build', 'src')

      if (isAnErbFile(relativeFilePath)) {
        relativeFilePath = `${relativeFilePath}.erb`
      }

      const filePath = [__dirname, relativeFilePath].join(process.path.sep)
      window.open(`vscode://file/${filePath}:${entry.line}:${entry.column}`)
    }
  })
} else {
  panic.configure({ handleErrors: false })
}
