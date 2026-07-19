import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowLeft, Trash2, Edit3, Heart, MessageCircle, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const getUserId = () => {
  const token = sessionStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1])).id;
  } catch { return null }
}

export default function SinglePost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const token = sessionStorage.getItem('token')
  const userId = getUserId()

  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then(res => {
        setPost(res.data)
        setEditData(res.data)
        setLoading(false)
      })
      .catch(err => { console.log(err); setLoading(false) })
  }, [id])

  const isAuthor = post?.author?._id === userId

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return
    try {
      await axios.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/')
    } catch (err) { alert(err.response?.data?.message || "Error") }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`/api/posts/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPost(res.data)
      setIsEditing(false)
    } catch (err) { alert(err.response?.data?.message || "Error") }
  }

  const handleLike = async () => {
    if (!token) return navigate('/auth')
    try {
      const res = await axios.post(`/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPost(res.data.post)
      setLiked(res.data.liked)
    } catch (err) { console.log(err) }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!token) return navigate('/auth')
    if (!comment.trim()) return
    try {
      const res = await axios.post(`/api/posts/${id}/comments`, { text: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPost(res.data)
      setComment('')
    } catch (err) { alert(err.response?.data?.message || "Error") }
  }

  const toggleBookmark = async () => {
    if (!token) return navigate('/auth')
    try {
      if (bookmarked) {
        await axios.delete(`/api/bookmarks/${post._id}`, { headers: { Authorization: `Bearer ${token}` } })
        setBookmarked(false)
      } else {
        await axios.post(`/api/bookmarks/${post._id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
        setBookmarked(true)
      }
    } catch (err) { console.log(err) }
  }

  if (loading) return <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-[#3b49df]" /></div>
  if (!post) return <div className="text-center pt-10">Post not found</div>

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <Link to="/" className="flex items-center gap-2 text-[#3b49df] mb-4 hover:underline">
        <ArrowLeft size={18} /> Back to Feed
      </Link>

      <article className="bg-white rounded-md shadow-sm border-gray-200 overflow-hidden">
        {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-80 object-cover" />}

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3b49df] to-blue-500 flex items-center justify-center text-white font-bold">
                {post.author?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="font-semibold">{post.author?.name}</p>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toDateString()}</p>
              </div>
            </div>

            {isAuthor && !isEditing && (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-gray-100 rounded"><Edit3 size={18} /></button>
                <button onClick={handleDelete} className="p-2 hover:bg-red-100 text-red-500 rounded"><Trash2 size={18} /></button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className="w-full border p-2 rounded text-2xl font-bold" />
              <textarea value={editData.content} onChange={e => setEditData({ ...editData, content: e.target.value })} rows="10" className="w-full border p-2 rounded font-mono" />
              <div className="flex gap-2">
                <button type="submit" className="bg-[#3b49df] text-white px-4 py-2 rounded">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex gap-2 mb-6 flex-wrap">
                {post.tags?.map(tag => <span key={tag} className="text-sm bg-gray-100 px-2 py-1 rounded">#{tag}</span>)}
              </div>

              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
              </div>
            </>
          )}

          <div className="border-t mt-8 pt-4 flex items-center gap-4">
            <button onClick={handleLike} className="flex items-center gap-2 hover:text-[#3b49df]">
              <Heart size={20} fill={liked ? "red" : "none"} color={liked ? "red" : "gray"} /> {post.reactions} likes
            </button>
            <button onClick={toggleBookmark} className="flex items-center gap-2 hover:text-[#3b49df]">
              <Bookmark size={20} fill={bookmarked ? "#3b49df" : "none"} /> Save
            </button>
          </div>

          <form onSubmit={handleComment} className="mt-6 flex gap-2">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border p-2 rounded-md"
            />
            <button type="submit" className="bg-[#3b49df] text-white px-4 rounded-md">Post</button>
          </form>

          <div className="mt-6 space-y-4">
            {post.comments?.map(c => (
              <div key={c._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-sm">{c.author?.name}</p>
                  <p className="text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}