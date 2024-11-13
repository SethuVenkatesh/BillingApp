import React from 'react'
import { Route,Routes,Router } from 'react-router-dom'
import Home from '../home/Home'
import Items from '../items/Items'
import Parties from '../parties/Parties'
import Employees from '../employees/Employees'
import Sales from '../sales/Sales'
const AllRoutes = () => {
  return (
    <div className='w-[calc(100vw-220px)] h-[100vh] p-4 overflow-y-auto'>

        <Routes>
            <Route path='' element={<Home/>}/>
            <Route path='home' element={<Home/>}/>
            <Route path='parties' element={<Parties/>} />
            <Route path='employees' element={<Employees/>}/>
            <Route path='items' element={<Items/>} />
            <Route path='sales/*' element={<Sales/>}/>
        </Routes>
    </div>
  )
}

export default AllRoutes