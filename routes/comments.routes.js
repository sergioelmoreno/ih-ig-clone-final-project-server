const router = require("express").Router()

const Comment = require('./../models/Comment.model')
const isAuthenticated = require('./../middleware/verifyToken')

router.get("/", isAuthenticated, (req, res, next) => {

  Comment
    .find()
    .then(comments => res.json(comments))
    .catch(err => next(err))
})

router.post("/new/:postId", isAuthenticated, (req, res, next) => {

  const { _id: owner } = req.payload
  const { postId: post } = req.params
  const { text } = req.body

  Comment
    .create({ owner, post, text })
    .then((newComment) => res.json(newComment))
    .catch(err => next(err))
})

router.put("/:commentId", isAuthenticated, (req, res) => {

  const { commentId } = req.params
  const { post, text } = req.body

  Comment
    .findByIdAndUpdate(commentId, { post, text }, { new: true })
    .then((comment) => res.json(comment))
    .catch(err => next(err))
})

router.delete("/:commentId", isAuthenticated, (req, res) => {

  const { commentId } = req.params

  Comment
    .findByIdAndDelete(commentId)
    .then((comment) => res.json(comment))
    .catch(err => next(err))
})



module.exports = router