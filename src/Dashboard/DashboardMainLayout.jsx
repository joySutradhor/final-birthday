import React from 'react'
import CreateBanner from './Banner/CreateBanner'
import CreateStory from './Story/CreateStory'

export default function DashboardLayout() {
  return (
    <section>
        <CreateBanner/>
        <CreateStory/>
    </section>
  )
}
