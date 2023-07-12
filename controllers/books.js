import Book from "../config/models/Book.js"
const errorResponseFunction = (res, error) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(error)
    }
    res.status(400).json({
        success: false,
        message: error
    })
}
/**
 * get all book informations from api
 * GET /api/v1/books/
 */
const getBooks = async (req, res) => {
    try {
        const books = await Book.find()
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        })
    } catch (error) {
        errorResponseFunction(res, error)
    }
}

/**
 * get a single book information from api with their ID
 * GET /api/v1/books/:id
 */
const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).json({success: false})
        }
        res.status(200).json({
            success: true,
            data: book
        })
    } catch (error) {
        errorResponseFunction(res, error)
    }
}

/**
 * create a book
 * POST /api/v1/books/
 */
const createBook = async (req, res) => {
    try {
        const book = await Book.create(req.body)
        res.status(201).json({
            success: true,
            data: book
        })
    } catch (error) {
        errorResponseFunction(res, error)
    }
}

/**
 * delete a book from db
 * DELETE /api/v1/books/:id
 */
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id)
        if (!book) {
            return res.status(404).json({success: false})
        }
        res.status(204).json({success: true, data: {} })
    } catch (error) {
        errorResponseFunction(res, error)
    }
}

/**
 * update a book from db
 * PATCH /api/v1/books/:id
 */
const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!book) {
            return res.status(404).json({success: false})
        }
        res.status(200).json({
            success: true,
            data: book
        })
    } catch (error) {
        errorResponseFunction(res, error)
    }
}

export {
    getBooks,
    createBook,
    deleteBook,
    updateBook,
    getBook
}