import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ReadingList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const token = sessionStorage.getItem('token')

  useEffect(() => {
    axios.get('/api/bookmarks', { headers: { Authorization: `Bearer ${token}` } })
     .then(res => { setPosts(res.data); setLoading(false) })
     .catch(err => { console.log(err); setLoading(false) })
  }, [])

  if (loading) return <Loader2 className="animate-spin" />
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reading List</h1>
      {posts.length === 0 ? <p>No saved posts yet</p> : (
        <div className="space-y-4">
          {posts.map(post => (
            <Link to={`/post/${post._id}`} key={post._id} className="block p-4 bg-white rounded shadow-sm hover:shadow-md">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-sm text-gray-500">By {post.author?.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}