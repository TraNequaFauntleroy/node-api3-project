const express = require('express');
const { 
  logger,
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
    .then(updated => {
      res.status(200).json(updated)
    })
    .catch(next)
});

//[DELETE] api/users/:id
router.delete('/:id', validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid

});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: "Something went wrong"
  })
})

// do not forget to export the router
module.exports = router