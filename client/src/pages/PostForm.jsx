import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [published, setPublished] = useState(false)
  const token = sessionStorage.getItem('token')

  useEffect(() => {
    if (isEditMode) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`)
        .then(res => {
          setTitle(res.data.title)
          setContent(res.data.content)
          setTags(res.data.tags.join(', '))
          setCoverImage(res.data.coverImage || '')
          setPublished(res.data.published)
        })
        .catch(err => console.log(err))
    }
  }, [id, isEditMode])

  const handleSubmit = async (e, shouldPublish) => {
    e.preventDefault()
    try {
      const postData = {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        coverImage,
        published: shouldPublish
      }

      if (isEditMode) {
        await axios.put(`/api/posts/${id}`, postData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert("Post updated!")
      } else {
        await axios.post('/api/posts', postData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert("Post created!")
      }

      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || "Error saving post")
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? 'Edit Post' : 'Create New Post'}
      </h1>

      <form className="space-y-4">
        {coverImage && (
          <img src={coverImage} alt="cover" className="w-full h-64 object-cover rounded-lg" />
        )}

        <input
          type="text"
          placeholder="Cover image URL: https://..."
          value={coverImage}
          onChange={e => setCoverImage(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
        <p className="text-sm text-gray-500">Paste an image URL. Ex: from unsplash.com</p>

        <input
          type="text"
          placeholder="New post title here..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full text-3xl font-bold border-none outline-none"
        />
        <textarea
          placeholder="Write your post content here..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows="15"
          className="w-full border rounded-lg p-4"
        />
        <input
          type="text"
          placeholder="Tags: react, javascript"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="w-full border rounded-lg p-2"
        />

        <div className="flex gap-3">
          <button
            onClick={(e) => handleSubmit(e, true)}
            className="bg-[#3b49df] text-white px-4 py-2 rounded-lg"
          >
            {isEditMode ? 'Save & Publish' : 'Publish'}
          </button>
          <button
            onClick={(e) => handleSubmit(e, false)}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  )
}