import React from 'react'
import { useDispatch } from 'react-redux'

import apiClient from '../../api/apiClient'
import { addAlert } from '../../redux/slices/appAlertSlice'
import './UserSettingsView.sass'


function UserSettingsSkeleton() {
  return (
    <div className=''>
      <div className='' >
        <div className=''>
          <div className=''></div>
        </div>
      </div>
    </div>
  )
}


export default function UserSettingsView() {
  return (
    <div>
      asd
    </div>
  )
}
