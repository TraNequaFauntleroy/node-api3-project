const express = require('express');
const { 
  validateUserId,
  validateUser,
  validatePost
} = require('../middleware/middleware')
const Users = require('./users-model')
const Posts = require('../posts/posts-model')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

//[GET] api/users
router.get('/', (req, res, next) => {
  Users.get()
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
});

//[GET] api/users/:id
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

//[POST] api/users
router.post('/', validateUser, (req, res, next) => {
  Users.insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

//[PUT] api/users/:id
router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  const { id } = req.params
  Users.update(id, req.body)
    .then(() => {
      return Users.getById(id)
    })
    .then(updatedUser => {
      res.json(updatedUser)
    })
    .catch(next)
});

//[DELETE] api/users/:id
router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    const { id } = req.params
    await Users.remove(id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
});

//[GET] api/users/:id/posts
router.get('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(next)
});

// router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
//   Posts.
  

// });

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: "Something went wrong"
  })
})

module.exports = router