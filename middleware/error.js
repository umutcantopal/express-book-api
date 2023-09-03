import ErrorResponse from "../utils/ErrorResponse.js"

const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    error.message = err.message
    if (err.name === 'CastError') { // bad request id error
        const message = 'Content not found'
        error = new ErrorResponse(message, 404)
    }

    if (err.code === 11000) { // duplicate entity error
        const message = `Duplicate Content [${Object.keys(err.keyPattern)}]`
        error = new ErrorResponse(message, 400)
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(el => el.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    })
}

export default errorHandler