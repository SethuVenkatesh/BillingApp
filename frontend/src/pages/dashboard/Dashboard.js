import React from 'react'
import { useState } from 'react'
import SideBar from '../../components/SideBar'
import AllRoutes from './AllRoutes'
import { useContext } from 'react'
import { UserDetailsContext } from '../../context/userContext'
import Loader from '../../components/common/Loader'

const Dashboard = () => {
  
 
  return (
    <div className='flex '>
            <SideBar/>
            <AllRoutes/>
        
    </div>
  )
}

export default Dashboard