import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, Heart, MessageCircle, Pencil, Trash2, Upload, Plus } from 'lucide-react';

export default function DashboardHome() {
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const isPublished = (p) => p.published === true || p.published === "true" || p.published === 1

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/posts/me')
      console.log("Posts from backend:", res.data) 
      setMyPosts(res.data)
    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message)
      if (err.response?.status === 401) {
        sessionStorage.clear()
        navigate('/auth')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchPosts() 
  }, [])

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/posts/${id}`)
      setMyPosts(myPosts.filter(p => p._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting")
    }
  }

  const handleEdit = async (id, newTitle) => {
  try {
    await axios.put(`/api/posts/${id}`, 
      { title: newTitle }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
    alert("Updated!")
    fetchPosts() 
  } catch (err) {
    alert(err.response?.data?.message || "Error updating")
  }
}

  if (loading) return <p className="p-6 text-center text-gray-500">Loading your posts...</p>

  const totalPosts = myPosts.length
  const publishedPosts = myPosts.filter(isPublished).length
  const draftPosts = totalPosts - publishedPosts

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link 
          to="/dashboard/new" 
          className="flex items-center gap-2 bg-[#3b49df] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#2f3ab2] transition"
        >
          <Plus size={16}/> Create Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-md shadow-sm border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Total Posts</p>
          <p className="text-3xl font-bold mt-1">{totalPosts}</p>
        </div>
        <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Published</p>
          <p className="text-3xl font-bold mt-1 text-green-600">{publishedPosts}</p>
        </div>
        <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm font-medium">Drafts</p>
          <p className="text-3xl font-bold mt-1 text-yellow-600">{draftPosts}</p>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Your Posts</h2>
        </div>

        {myPosts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500 mb-4">You haven't written any posts yet.</p>
            <Link to="/dashboard/new" className="text-[#3b49df] font-semibold hover:underline">Write your first post</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {myPosts.map(post => (
              <div key={post._id} className="p-4 flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:bg-gray-50 transition">
                

                <div className="flex-1 min-w-0">
                  <Link to={isPublished(post) ? `/post/${post._id}` : `/dashboard/edit/${post._id}`} className="font-semibold text-lg hover:text-[#3b49df]">
                    {post.title || 'Untitled'}
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isPublished(post) ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {isPublished(post) ? 'Published' : 'Draft'}
                    </span>
                    <span className="flex items-center gap-1"><Heart size={14}/>{post.reactions || 0} reactions</span>
                    <span className="flex items-center gap-1"><MessageCircle size={14}/>{post.comments?.length || 0} comments</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isPublished(post) && (
                    <button 
                      onClick={() => handleEdit(post._id)}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-700 transition"
                    >
                      <Upload size={14}/> Publish
                    </button>
                  )}
                  {isPublished(post) && (
                    <Link to={`/post/${post._id}`} className="p-2 text-gray-500 hover:text-[#3b49df] hover:bg-gray-100 rounded" title="View">
                      <Eye size={18}/>
                    </Link>
                  )}
                  <Link to={`/dashboard/edit/${post._id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded" title="Edit">
                    <Pencil size={18}/>
                  </Link>
                  <button onClick={() => handleDelete(post._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded" title="Delete">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )} 
      </div>
    </div>
  )
}