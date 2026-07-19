import Navbar from './Navbar'
import Footer from './Footer'

import React from 'react'
export default function Layout({children}) {
  return (
    <div className="min-h-screen bg-dev-bg">
      <Navbar />
      <div className="max-w-[1280px] mx-auto px-2 md:px-4 py-4">
        {children}
      </div>
      <Footer />
    </div>
  )
}