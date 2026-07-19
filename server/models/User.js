import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // <-- MUST BE INSIDE
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)