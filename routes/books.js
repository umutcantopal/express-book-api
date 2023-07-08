import express from 'express'
import { getBooks, createBook, getBook, deleteBook, updateBook } from '../controllers/books.js'

const router = express.Router()

router.route('/')
    .get(getBooks)
    .post(createBook)

router.route('/:id')
    .get(getBook)
    .delete(deleteBook)
    .patch(updateBook)

export default router
