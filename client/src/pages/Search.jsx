import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (query) {
      axios.get(`/api/posts/search?q=${query}`)
       .then(res => setResults(res.data))
       .catch(err => console.log(err))
    }
  }, [query])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Results for "{query}"</h1>
      {results.length === 0? <p>No posts found</p> :
        results.map(post => (
          <Link key={post._id} to={`/post/${post._id}`} className="block p-4 border-b hover:bg-gray-50">
            <h2 className="font-bold text-lg">{post.title}</h2>
            <p className="text-gray-600 text-sm">{post.content.substring(0, 150)}...</p>
          </Link>
        ))
      }
    </div>
  )
}