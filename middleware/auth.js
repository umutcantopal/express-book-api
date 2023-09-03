import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import ErrorResponse from '../utils/ErrorResponse.js'
import asyncHandler from './asyncHandler.js'

/**
 * check token is correct
 */
const checkAuthToken = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new ErrorResponse('authorization error while accessing', 401))
  }

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(tokenDecoded.id)
    next()
  } catch (error) {
    return next(new ErrorResponse('authorization error while accessing', 401))
  }
})

/**
 * check user role
 */
const checkUserRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`no auth for ${req.user.role} role to this route`, 403))
    }
    next()
  }
}

export {
  checkAuthToken,
  checkUserRole
}
