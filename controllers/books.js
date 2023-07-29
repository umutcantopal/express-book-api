import Book from "../models/Book.js"
import asyncHandler from "../middleware/asyncHandler.js"
import ErrorResponse from "../utils/ErrorResponse.js"

/**
 * get all book informations from api
 * GET /api/v1/books/
 */
const getBooks = asyncHandler(async (req, res) => {
    const books = await Book.find()
    res.status(200).json({
        success: true,
        count: books.length,
        data: books
    })
})

/**
 * get a single book information from api with their ID
 * GET /api/v1/books/:id
 */
const getBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id)
    if (!book) {
        return next(new ErrorResponse(`The content you are looking for with ${req.params.id} not found`, 404))
    }
    res.status(200).json({
        success: true,
        data: book
    })
})

/**
 * create a book
 * POST /api/v1/books/
 */
const createBook = asyncHandler(async (req, res, next) => {
    const book = await Book.create(req.body)
    res.status(201).json({
        success: true,
        data: book
    })
})

/**
 * delete a book from db
 * DELETE /api/v1/books/:id
 */
const deleteBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findByIdAndDelete(req.params.id)
    if (!book) {
        return next(new ErrorResponse(`The content you are looking for with ${req.params.id} not found`, 404))
    }
    res.status(204).json({success: true, data: {} })
})

/**
 * update a book from db
 * PATCH /api/v1/books/:id
 */
const updateBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!book) {
        return next(new ErrorResponse(`The content you are looking for with ${req.params.id} not found`, 404))
    }
    res.status(200).json({
        success: true,
        data: book
    })
})

export {
    getBooks,
    createBook,
    deleteBook,
    updateBook,
    getBook
}