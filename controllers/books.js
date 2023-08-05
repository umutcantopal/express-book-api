import Book from "../models/Book.js"
import asyncHandler from "../middleware/asyncHandler.js"
import ErrorResponse from "../utils/ErrorResponse.js"

/**
 * get all book informations from api
 * GET /api/v1/books/
 */
const getBooks = asyncHandler(async (req, res) => {
    const requestQuery = { ...req.query }
    const removeFields = ['sort', 'select', 'page', 'limit']
    removeFields.forEach(param => delete requestQuery[param])

    let queryStr = JSON.stringify(requestQuery)

    // filtering
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

    let query = Book.find(JSON.parse(queryStr))

    // sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }

    // selecting fields
    if (req.query.select) {
        const selectedFields = req.query.select.split(',').join(' ')
        query = query.select(selectedFields)
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const skipDocumentNum = (page - 1) * limit
    const endIndex = page * limit
    const totalCount = await Book.countDocuments()

    const paginationInfo = {}

    if (totalCount > endIndex) {
        paginationInfo.next = {
            page: page + 1,
            limit
        }
    }

    if (skipDocumentNum > 0) {
        paginationInfo.prev = {
            page: page - 1,
            limit
        }
    }

    query = query.skip(skipDocumentNum).limit(limit)
    
    const books = await query
    res.status(200).json({
        success: true,
        count: books.length,
        pagination: paginationInfo,
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