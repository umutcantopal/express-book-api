import express from 'express'
import { register, login, getLoggedUserData } from '../controllers/auth.js'
import { checkAuthToken } from '../middleware/auth.js'
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', checkAuthToken, getLoggedUserData)

export default router
