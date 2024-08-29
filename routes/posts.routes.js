const router = require("express").Router()
const Post = require("./../models/Post.model")
const isAuthenticated = require("./../middleware/verifyToken")

router.get('/', (req, res, next) => {

  Post
    .find()
    .select({ images: 1, date: 1, likes: 1 })
    .populate('owner', 'nick avatar')
    .then((posts) => res.json(posts))
    .catch(err => next(err))
})


router.get('/my-posts', isAuthenticated, (req, res, next) => {

  const { _id: owner } = req.payload

  Post
    .find({ owner })
    .then((posts) => res.json(posts))
    .catch(err => next(err))
})

router.get('/my-posts/liked', isAuthenticated, (req, res, next) => {

  const { _id: owner } = req.payload

  Post
    .find({ owner })
    .select({ likes: 1, images: 1, date: 1 })
    .sort({ date: 1 })
    .then((posts) => res.json(posts))
    .catch(err => next(err))
})

router.get('/post/:postId', isAuthenticated, (req, res, next) => {

  const { postId } = req.params

  Post
    .findById(postId)
    .populate('owner', 'nick avatar')
    .populate('comments')
    .then((posts) => res.json(posts))
    .catch(err => next(err))
})

router.post('/', isAuthenticated, (req, res, next) => {

  const { images, description, date, comments, categories, likes, latitude, longitude, address } = req.body
  const { _id: owner } = req.payload

  const location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  }

  Post
    .create({ owner, images, description, date, comments, categories, likes, location, address })
    .then((newPost) => res.json(newPost))
    .catch(err => next(err))
})

router.put('/post/edit/:postId', isAuthenticated, (req, res, next) => {

  const { postId } = req.params
  const { images, description, date, comments, categories, likes, latitude, longitude, address } = req.body

  const location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  }

  Post
    .findByIdAndUpdate(postId, { images, description, date, comments, categories, likes, location, address }, { new: true })
    .then((post) => res.json(post))
    .catch(err => next(err))
})

router.delete('/delete/:postId', isAuthenticated, (req, res, next) => {

  const { postId } = req.params

  Post
    .findByIdAndDelete(postId)
    .then((post) => res.json(post))
    .catch(err => next(err))
})

module.exports = router