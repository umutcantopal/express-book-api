import express from 'express'
import { getBooks, createBook, getBook, deleteBook, updateBook, uploadPhoto } from '../controllers/books.js'
import commentRoutes from './comments.js'
import advancedResults from '../middleware/advancedResults.js'
import Book from '../models/Book.js'

const router = express.Router()

// redirect to another controller routes
router.use('/:bookId/comments', commentRoutes)
router.use('/:bookId/photo', uploadPhoto)

router.route('/')
    .get(advancedResults(Book), getBooks)
    .post(createBook)

router.route('/:id')
    .get(getBook)
    .delete(deleteBook)
    .patch(updateBook)

export default router
