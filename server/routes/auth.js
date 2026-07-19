import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body)
    const { name, email, password } = req.body
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ error: 'User already exists' })
    
    const hashed = await bcrypt.hash(password, 10)
    user = new User({ name, email, password: hashed })
    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
    
  } catch(err) {
    console.log("REGISTER ERROR:", err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body)
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      console.log("User not found:", email)
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log("Password wrong for:", email)
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch(err) {
    console.log("LOGIN ERROR:", err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router