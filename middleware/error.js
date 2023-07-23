import ErrorResponse from "../utils/ErrorResponse.js"

const errorHandler = (err, req, res, next) => {
    console.log(err.name)
    let error = { ...err }
    error.message = err.message
    if (err.name === 'CastError') {
        const message = `Content not found`
        error = new ErrorResponse(message, 404)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    })
}

export default errorHandler