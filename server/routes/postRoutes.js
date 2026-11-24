
const { Router } = require('express')

const {
    createPost,
    getPosts,
    getPost,
    getCatPosts,
    getUserPosts,
    editPost,
    deletePost
} = require('../controllers/postControllers')

const authMiddleware = require('../middleware/authMiddleware')

const router = Router()

// Create post
router.post('/', authMiddleware, createPost)

// Get all posts
router.get('/', getPosts)

// Get posts by category
router.get('/categories/:category', getCatPosts)

// Get posts by user
router.get('/users/:id', getUserPosts)

// Get single post
router.get('/:id', getPost)

// Edit post
router.patch('/:id', authMiddleware, editPost)

// Delete post
router.delete('/:id', authMiddleware, deletePost)

module.exports = router
