import React from 'react'
import { connect } from 'react-redux'

export const Sidebar = (props) => {
  return (
    <div>Sidebar</div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)

// code above is React snippet from 'VS Code ES7+ React/Redux/React-Native/JS snippets'