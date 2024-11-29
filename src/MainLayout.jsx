import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
        <Header></Header>
        <Outlet></Outlet>
    </div>
  )
}

export default MainLayout