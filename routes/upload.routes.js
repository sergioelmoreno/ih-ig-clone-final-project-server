const router = require("express").Router()

const uploader = require('./../middleware/cloudinary.middleware')

router.post('/image', uploader.single('imageData'), (req, res) => {

  if (!req.file) {
    res.status(500).json({ errorMessage: 'Uploading image error' })
    return
  }

  res.json({ cloudinary_url: req.file.path })
})

router.post('/images', uploader.array('imageData'), (req, res) => {

  if (!req.files) {
    res.status(500).json({ errorMessage: 'Uploading image error' })
    return
  }

  const paths = req.files.map(elm => elm.path)

  res.json({ cloudinary_urls: paths })
})

module.exports = router