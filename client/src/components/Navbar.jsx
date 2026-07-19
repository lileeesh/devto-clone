import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, LayoutDashboard, PenSquare, Plus, Bookmark, LogOut, Search } from 'lucide-react' 
import React from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('') 
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const token = sessionStorage.getItem('token')

  useEffect(() => {
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split('.')[1]))
        setUser(userData)
      } catch (e) {
        console.log("Invalid token")
        sessionStorage.clear()
      }
    } else {
      setUser(null)
    }
  }, [token])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current &&!dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    setUser(null)
    setOpen(false)
    navigate('/auth')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
      setSearchQuery('')
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14 gap-4">
        <Link to="/" className="text-2xl font-bold text-black flex-shrink-0">Dev</Link>
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find related post"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b49df] focus:border-transparent"/>
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </form>

        <div className="flex items-center gap-4 flex-shrink-0">
          {token? (
            <>
              <Link to="/dashboard/new" className="bg-[#3b49df] text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-[#2f3ab2] hidden sm:block">
                Create Post
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3b49df] to-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.[0]?.toUpperCase() || <User size={18} />}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{user?.name}</span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs text-gray-500">@{user?.name?.toLowerCase().replace(' ', '')}</p>
                    </div>
                    <Link onClick={() => setOpen(false)} to="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/dashboard/writing" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm">
                      <PenSquare size={16} /> Writing
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/dashboard/new" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm">
                      <Plus size={16} /> Create Post
                    </Link>
                    <Link onClick={() => setOpen(false)} to="/dashboard/readinglist" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm">
                      <Bookmark size={16} /> Reading List
                    </Link>

                    <div className="border-t border-gray-200 mt-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/auth" className="text-gray-700 hover:text-black">Log in</Link>
              <Link to="/auth" className="border border-[#3b49df] text-[#3b49df] px-4 py-1.5 rounded-md hover:bg-[#3b49df] hover:text-white">Create account</Link>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Find related post" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b49df]"/>
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </form>
      </div>
    </nav>
  )
}