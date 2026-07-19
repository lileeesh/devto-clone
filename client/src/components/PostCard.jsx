import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function PostCard({ post }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md mb-4 hover:shadow-md transition-shadow">
      <div className="p-4 pb-0">
        <div className="flex items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${post.author?.name || 'U'}&background=3b49df&color=fff`}
            className="w-8 h-8 rounded-full"
            alt="author"
          />
          <div>
            <p className="font-semibold text-sm hover:text-dev-purple cursor-pointer">
              {post.author?.name || 'Unknown'}
            </p>
            <p className="text-xs text-gray-500">
              {post.createdAt ? format(new Date(post.createdAt), 'MMM dd') : 'Just now'}
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <Link to={`/post/${post._id}`}>
          <h2 className="text-2xl font-bold hover:text-dev-purple mb-2 mt-2">
            {post.title}
          </h2>
        </Link>
        <div className="flex gap-2 flex-wrap mb-3">
          {post.tags?.map(tag => (
            <span
              key={tag}
              className="text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
            <Heart size={18} />
            0 reactions
          </span>
          <span className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
            <MessageCircle size={18} />
            {post.comments?.length || 0} comments
          </span>
        </div>
      </div>
    </div>
  )
}