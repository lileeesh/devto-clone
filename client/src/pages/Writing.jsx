import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Eye, Plus, FileText } from 'lucide-react';

export default function Writing() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('published') 
  const [loading, setLoading] = useState(true)
  const token = sessionStorage.getItem('token')

  const fetchPosts = () => {
    if (!token) { setLoading(false); return }
    axios.get(`${import.meta.env.VITE_API_URL}/api/posts/my-posts`,  { 
      headers: { Authorization: `Bearer ${token}` } 
    })
    .then(res => { 
      setPosts(res.data); 
      setLoading(false) 
    })
    .catch(err => { 
      console.log(err.response?.data) 
      setLoading(false) 
    })
  }

  useEffect(() => { fetchPosts() }, [token])

  const handleDelete = async (id) => {
    if(window.confirm("Delete this post?")){
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        setPosts(posts.filter(p => p._id !== id))
      } catch(err) { alert("Failed to delete") }
    }
  }

  const handleEdit = (id) => { navigate(`/dashboard/edit/${id}`) }

  const publishedPosts = posts.filter(p => p.published === true)
  const draftPosts = posts.filter(p => p.published === false)
  const postsToShow = activeTab === 'published' ? publishedPosts : draftPosts

  if (loading) return <p className="text-center py-10">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Writing</h1>
        <Link to="/dashboard/new" className="bg-[#3b49df] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2">
          <Plus size={18}/> Create Post
        </Link>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button 
            onClick={() => setActiveTab('published')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'published' 
              ? 'border-[#3b49df] text-[#3b49df]' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Published ({publishedPosts.length})
          </button>
          <button 
            onClick={() => setActiveTab('drafts')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'drafts' 
              ? 'border-[#3b49df] text-[#3b49df]' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Drafts ({draftPosts.length})
          </button>
        </nav>
      </div>

      {postsToShow.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold">
            {activeTab === 'drafts' ? 'No drafts yet' : 'No published posts yet'}
          </h2>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {postsToShow.map(post => (
            <div key={post._id} className="p-5 border-b last:border-b-0 hover:bg-gray-50 flex justify-between items-center">
              <div className="flex-1">
                <h2 className="font-bold text-lg">{post.title}</h2>
                <div className="text-sm text-gray-500 flex gap-4 mt-1">
                  <span className={post.published ? 'text-green-600' : 'text-yellow-600'}>
                    {post.published ? '● Published' : '● Draft'}
                  </span>
                  <span className="flex items-center gap-1"><Eye size={14}/> {post.reactions}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(post._id)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Pencil size={18}/>
                </button>
                <button onClick={() => handleDelete(post._id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}