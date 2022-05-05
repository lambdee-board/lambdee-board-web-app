import panic from 'panic-overlay'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { get } from 'lodash'
import erbSourceFiles from 'erb-compilation/erb-source-files'

import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

const isAnErbFile = (relativeFilePath) => {
  let filePathArray = relativeFilePath.split(process.path.sep)
  return get(erbSourceFiles, filePathArray.splice(1))
}

if(process.env.NODE_ENV === 'development') {
  panic.configure ({
    projectRoot: __dirname,
    stackEntryClicked(entry) {
      if(!entry.fileRelative.includes(`build${process.path.sep}`) && !entry.fileRelative.includes(`src${process.path.sep}`)) return

      let relativeFilePath = entry.fileRelative.replace("build", "src")

      if(isAnErbFile(relativeFilePath)) {
        relativeFilePath = `${relativeFilePath}.erb`
      }

      let filePath = [__dirname, relativeFilePath].join(process.path.sep)
      window.open(`vscode://file/${filePath}:${entry.line}:${entry.column}`);
    }
  })
} else {
  panic.configure ({ handleErrors: false })
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
