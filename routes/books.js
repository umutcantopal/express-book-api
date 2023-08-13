import express from 'express'
import { getBooks, createBook, getBook, deleteBook, updateBook } from '../controllers/books.js'
import { createComment, getComments } from '../controllers/comments.js'
import commentRoutes from './comments.js'

const router = express.Router()


// redirect to another controller routes
router.use('/:bookId/comments', commentRoutes)

router.route('/')
    .get(getBooks)
    .post(createBook)

router.route('/:id')
    .get(getBook)
    .delete(deleteBook)
    .patch(updateBook)

export default router
