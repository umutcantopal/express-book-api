import Book from "../models/Book.js"
import asyncHandler from "../middleware/asyncHandler.js"
import ErrorResponse from "../utils/ErrorResponse.js"
import path from 'path'
import fs from "fs"

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

/** 
 * upload a photo for book model
 * PATCH /api/v1/books/:id/photo
*/
const uploadPhoto = asyncHandler(async (req, res, next) => {
    const file = req?.files?.file
    const book = await Book.findById(req.params.bookId)
    if (!book) {
        return next(new ErrorResponse(`The content you are looking for with ${req.params.id} not found`, 404))
    }

    if (!file) {
        return next(new ErrorResponse('Upload a file', 400))
    }

    if (!file.mimetype.startsWith('image')) {
       return next(new ErrorResponse('Upload an image file', 400))
    }

    if (file.size > process.env.MAX_FILE_SIZE) {
        return next(new ErrorResponse(`applicable max file size is ${process.env.MAX_FILE_SIZE} bytes`, 400))
    }

    if (book.image) {
        // delete old image if exists
        fs.stat(`${process.env.FILE_UPLOAD_PATH}/${book.image}`, async (err, stat) => {
            if (stat) {
                await fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${book.image}`, (err) => {
                    if (err) {
                        return next(new ErrorResponse('old image uploaded for this content could not removed', 400))
                    }
                })
            }
        })
    }

    file.name = `image-${req.params.bookId}-${Math.ceil(Math.random() * 10000000000)}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
        if (error) {
            console.log(error)
            return next(new ErrorResponse('something went wrong', 400))
        }

        book.image = file.name
        const updatedRecord = await book.save()
        res.status(200).json({
            success: true,
            data: updatedRecord
        })
    })
})

export {
    getBooks,
    createBook,
    deleteBook,
    updateBook,
    getBook,
    uploadPhoto
}