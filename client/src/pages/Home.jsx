import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-md shadow-sm mb-4 overflow-hidden hover:shadow-md transition">
      {post.coverImage && (
        <Link to={`/post/${post._id}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-48 md:h-64 object-cover hover:opacity-90 transition"
          />
        </Link>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-dev-purple to-blue-500 flex items-center justify-center text-white font-bold text-xs">
            {post.author?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold">{post.author?.name || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toDateString()}</p>
          </div>
        </div>

        <Link to={`/post/${post._id}`}>
          <h2 className="text-2xl font-bold hover:text-dev-purple mb-2">{post.title}</h2>
        </Link>

        <div className="flex gap-2 mb-3 flex-wrap">
          {post.tags?.map(tag => (
            <Link key={tag} to={`/t/${tag}`} className="text-sm text-gray-600 hover:text-dev-purple cursor-pointer">
              #{tag}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-3">
          <button className="hover:text-dev-purple">❤️ {post.reactions || 0} reactions</button>
          <button className="hover:text-dev-purple">💬 {post.comments?.length || 0} comments</button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/posts`)
      .then(res => {
        setPosts(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/')
  }

  if (loading) return <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-dev-purple" /></div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 pt-4">
      <aside className="hidden lg:block space-y-4">

        {!token ? (
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-bold text-lg mb-2">DEV Community is a community of amazing developers</h3>
            <p className="text-sm text-gray-600 mb-4">
              A constructive and inclusive social network for software developers. With you every step of your journey.
            </p>
            <Link to="/auth" className="block w-full text-center border border-dev-purple text-dev-purple font-semibold py-2 rounded-md hover:bg-blue-50 mb-2">
              Create account
            </Link>
            <Link to="/auth" className="block w-full text-center text-dev-purple font-semibold py-2 rounded-md hover:bg-blue-50">
              Log in
            </Link>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-bold text-lg mb-3">Welcome back!</h3>
            <Link to="/dashboard/new" className="block w-full text-center bg-dev-purple text-white font-semibold py-2 rounded-md hover:bg-blue-700 mb-2">
              Create Post
            </Link>
            <Link to="/dashboard" className="block w-full text-center text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-100 mb-2">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="block w-full text-center text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-100">
              Log out
            </button>
          </div>
        )}

        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="font-bold mb-2">HOME</h3>
          <div className="flex flex-col gap-1 text-sm">
            <Link to="#" className="hover:text-dev-purple py-1 px-2 rounded hover:bg-gray-100">DEV CHALLENGE</Link>
            <Link to="#" className="hover:text-dev-purple py-1 px-2 rounded hover:bg-gray-100">VIDEOS</Link>
            <Link to="#" className="hover:text-dev-purple py-1 px-2 rounded hover:bg-gray-100">DEV HELP</Link>
            <Link to="#" className="hover:text-dev-purple py-1 px-2 rounded hover:bg-gray-100">DEV EDUCATION TRACK</Link>
             <Link to="#" className="hover:text-dev-purple py-1 px-2 rounded hover:bg-gray-100">DEV CHALLENGE</Link>
            <Link to="#" className="hover:text-dev-purple py-1 px-2 rounded hover:bg-gray-100">VIDEOS</Link>
            <Link to="#" className="hover:text-dev-purple py-1 px-2 rounded hover:bg-gray-100">DEV HELP</Link>
            <Link to="#" className="hover:text-dev-purple py-1 px-2 rounded hover:bg-gray-100">DEV EDUCATION TRACK</Link>
          </div>
        </div>
      </aside>
      <main className="lg:col-span-2">
        <div className="flex gap-4 mb-4 border-b bg-white px-4 pt-2 rounded-t-md">
          <button className="font-bold border-b-2 border-dev-purple pb-2">Feed</button>
          <button className="text-gray-600 pb-2 hover:text-black">Latest</button>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-md shadow-sm">
            <p>No posts yet. Be the first to <Link to="/dashboard/new" className="text-dev-purple font-semibold">create one</Link>!</p>
          </div>
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} />)
        )}
      </main>

      <aside className="hidden lg:block space-y-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="font-bold mb-2">Listings</h3>
          <p className="text-sm text-gray-600">See all</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="font-bold mb-2">#help</h3>
          <p className="text-sm">Need help with React hooks</p>
        </div>
      </aside>
    </div>
  )
}