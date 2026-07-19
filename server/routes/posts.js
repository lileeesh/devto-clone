import express from 'express'
import Post from '../models/Post.js'
import auth from '../middleware/auth.js'
const router = express.Router()

// GET all published posts - for home feed
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .populate('author', 'name username')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// GET my posts - for Writing page
router.get('/my-posts', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
});

// GET my posts - for dashboard
router.get('/me', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('author', 'name username')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// GET my drafts
router.get('/me/drafts', auth, async (req, res) => {
  try {
    const drafts = await Post.find({ author: req.user.id, published: false })
      .populate('author', 'name username')
      .sort({ createdAt: -1 })
    res.json(drafts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

//  publish all
router.get('/publish-all', async (req, res) => {
  try {
    const result = await Post.updateMany({}, { published: true })
    res.json({ message: `Published ${result.modifiedCount} posts` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name username')
      .populate('comments.author', 'name username')
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// CREATE post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, coverImage, published } = req.body
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required' })
    }
    const post = new Post({
      title,
      content,
      tags,
      coverImage,
      published: published || false,
      author: req.user.id
    })
    await post.save()
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// UPDATE post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      req.body,
      { new: true }
    ).populate('author', 'name username')

    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// DELETE post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id })
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// PUBLISH single post
router.put('/:id/publish', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.published = true;
    await post.save();
    res.json({ message: 'Post published', post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LIKE a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.reactions += 1;
    await post.save();

    res.json({ message: 'Liked', post, liked: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  COMMENT a post
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      text,
      author: req.user.id,
      createdAt: new Date()
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name username')
      .populate('comments.author', 'name username');

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search', async (req, res) => {
  const q = req.query.q
  const posts = await Post.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ]
  }).limit(20)
  res.json(posts)
})

export default router