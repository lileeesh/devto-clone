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
  'https://devto-clone-l70omnhvc-nana-devto.vercel.app'
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
app.use('/api/posts', postRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
)

