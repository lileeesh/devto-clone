import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PenSquare, Plus, Bookmark, LogOut } from 'lucide-react';
import React from 'react';
import axios from 'axios';


export default function Dashboard() {
  const navigate = useNavigate()
  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    navigate('/auth')
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Writing', icon: PenSquare, path: '/dashboard/writing' },
    { name: 'Create Post', icon: Plus, path: '/dashboard/new' },
    { name: 'Reading List', icon: Bookmark, path: '/dashboard/readinglist' },
  ]

  return (
    <div className="flex gap-6 max-w-7xl mx-auto mt-6">
      <aside className="w-64 hidden md:block">
        <div className="bg-white rounded-lg p-2">
          {menuItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-dev-bg font-medium"
            >
              <item.icon size={20} /> {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-red-50 text-red-600 font-medium mt-2"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <Outlet /> 
      </main>
    </div>
  )
}