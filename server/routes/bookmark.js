import express from 'express'
import User from '../models/User.js'
import Post from '../models/Post.js'
import auth from '../middleware/auth.js'
const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: { path: 'author', select: 'name username' }
    })
    res.json(user.bookmarks.filter(p => p && p.published))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/:postId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user.bookmarks.includes(req.params.postId)) {
      user.bookmarks.push(req.params.postId)
      await user.save()
    }
    res.json({ message: 'Added to reading list' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:postId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== req.params.postId)
    await user.save()
    res.json({ message: 'Removed from reading list' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router