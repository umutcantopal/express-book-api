import User from "../models/User.js"
import asyncHandler from "../middleware/asyncHandler.js"
import ErrorResponse from "../utils/ErrorResponse.js"

/**
 * register a new user
 * POST /api/v1/auth/register
 */
const register = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body
  const user = await User.create({
    username,
    password,
    email,
    role: "user",
  })

  const token = user.getSignedJwt()
  res.status(200).json({ success: true, token })
})

/**
 * login a user
 * POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email, !password) {
    return next(new ErrorResponse('provide credentials', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('invalid credentials', 401))
  }

  const isPasswordMatch = await user.comparePassword(password)

  if(!isPasswordMatch) {
    return next(new ErrorResponse('invalid credentials', 401))
  }

  const token = user.getSignedJwt()
  res.status(200).json({ success: true, token })
})

export {
  register,
  login,
}
