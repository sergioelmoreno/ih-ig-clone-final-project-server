const router = require("express").Router()
const User = require("../models/User.model")
const isAuthenticated = require("../middleware/verifyToken")
const Post = require("../models/Post.model")
const Comment = require("../models/Comment.model")


router.get("/", isAuthenticated, (req, res, next) => {

  const { _id } = req.payload

  User
    .findById({ _id })
    .select({ password: 0 })
    .then(userData => res.json(userData))
    .catch(err => next(err))
})

router.put("/", isAuthenticated, (req, res, next) => {

  const { firstname, lastname, birth, country, phone, avatar } = req.body
  const { _id } = req.payload

  User
    .findByIdAndUpdate(_id, { firstname, lastname, birth, country, phone, avatar }, { new: true })
    .then(userData => res.json(userData))
    .catch(err => next(err))
})

router.delete('/delete/:userId', isAuthenticated, (req, res, next) => {

  const { userId: owner } = req.params

  const promises = [
    User.findByIdAndDelete(owner),
    Post.deleteMany({ owner }),
    Comment.deleteMany({ owner })
  ]

  Promise
    .all(promises)
    .then(() => res.sendStatus(200))
    .catch(err => next(err))
})

module.exports = router