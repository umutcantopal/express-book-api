import express from 'express'
import { getBooks, createBook, getBook, deleteBook, updateBook, uploadPhoto } from '../controllers/books.js'
import commentRoutes from './comments.js'
import advancedResults from '../middleware/advancedResults.js'
import Book from '../models/Book.js'
import { checkAuthToken, checkUserRole } from '../middleware/auth.js'

const router = express.Router()

// redirect to another controller routes
router.use('/:bookId/comments', commentRoutes)
router.use('/:bookId/photo', checkAuthToken, checkUserRole('admin', 'moderator'), uploadPhoto)

router.route('/')
    .get(advancedResults(Book), getBooks)
    .post(checkAuthToken, checkUserRole('admin', 'moderator'), createBook)

router.route('/:id')
    .get(getBook)
    .delete(checkAuthToken, checkUserRole('admin', 'moderator'), deleteBook)
    .patch(checkAuthToken, checkUserRole('admin', 'moderator'), updateBook)

export default router
