import Comment from "../models/Comment.js"
import Book from '../models/Book.js'
import asyncHandler from "../middleware/asyncHandler.js"
import ErrorResponse from "../utils/ErrorResponse.js"

/**
 * get comments from api
 * GET /api/v1/comments/
 * GET /api/v1/books/:bookId/comments/
 */
const getComments = asyncHandler(async (req, res, next) => {
    if (req.params.bookId) {
        // comments for a book
        res.status(200).json(res.advancedResults)
    } else {
        // all comments
        res.status(200).json(res.advancedResults)
    }
})

/**
 * create comment record
 * POST /api/v1/books/:bookId/comments/
 */
const createComment = asyncHandler(async (req, res, next) => {
    const bookId = req.params.bookId
    req.body.book = bookId
    const book = await Book.findById(bookId)
    if (!book) {
        return next(new ErrorResponse(`No book found with given id`, 404))
    }

    const comment = await Comment.create(req.body)
    res.status(201).json({
        success: true,
        data: comment
    })
})

/**
 * get single comment by id
 * GET /api/v1/comments/:commentId
 */
const getComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
        return next(new ErrorResponse(`No content found with given id`, 404))
    }
    return res.status(200).json({
        success: true,
        data: comment
    })
})

/**
 * get single comment by id
 * PUT /api/v1/comments/:commentId
 */
const updateComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {
        new: true,
        runValidators: true
    })
    if (!comment) {
        return next(new ErrorResponse(`No content found with given id`, 404))
    }

    return res.status(200).json({
        success: true,
        data: comment
    })
})

/**
 * delete comment by id
 * DELETE /api/v1/comments/:commentId
 */
const deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
        return next(new ErrorResponse(`No content found with given id`, 404))
    }
    await comment.deleteOne()
    return res.status(204).json({
        success: true,
        data: {}
    })
})

export {
    getComments,
    createComment,
    getComment,
    updateComment,
    deleteComment
}