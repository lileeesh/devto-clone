import jwt from 'jsonwebtoken'

function auth(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      id: decoded.id || decoded._id || decoded.user?.id || decoded.user?._id
    }

    if (!req.user.id) {
      return res.status(401).json({ message: 'Invalid token payload' })
    }

    next()
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' })
  }
}

export default auth;