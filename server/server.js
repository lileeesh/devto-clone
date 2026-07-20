import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import bookmarkRoutes from './routes/bookmark.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const allowedOrigins = [
  'http://localhost:5173',
  'https://devto-clone-l70omnhvc-nana-devto.vercel.app',
  'https://devto-clone-i824d5w49-nana-devto.vercel.app'  
]

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/bookmarks', bookmarkRoutes)


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)
