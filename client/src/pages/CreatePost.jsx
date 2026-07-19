import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token')
    
    if(!token) {
      alert("Please login first")
      navigate('/auth')
      return
    }

    try {
      await axios.post('http://localhost:5000/api/posts', 
        { 
          title, 
          content, 
          tags: tags.split(',').map(t => t.trim()).filter(t => t),
          coverImage,
          published: true 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert("Post published!")
      navigate('/') 
    } catch(err) {
      alert(err.response?.data?.message || 'Error creating post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-md shadow-sm mt-6">
      <div className="border-b p-4">
        <h1 className="text-xl font-bold">Create Post</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Cover Image URL</label>
          <input 
            type="text" 
            placeholder="https://images.unsplash.com/..."
            className="w-full border rounded-md p-2 text-sm"
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
          />
          {coverImage && <img src={coverImage} alt="preview" className="mt-2 w-full h-64 object-cover rounded" />}
        </div>

        <input 
          type="text" 
          placeholder="New post title here..." 
          className="w-full text-3xl font-bold outline-none mb-4"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        
        <input 
          type="text" 
          placeholder="Add tags separated by commas" 
          className="w-full border-b pb-2 mb-4 outline-none text-sm"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />

        <textarea 
          placeholder="Write your post content here..."
          rows="18"
          className="w-full outline-none border border-gray-300 rounded-md p-3 font-mono text-sm"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />

        <div className="flex gap-3 mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-dev-purple text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  )
}



