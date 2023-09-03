import express from 'express'
import { getComments, createComment, getComment, updateComment, deleteComment } from '../controllers/comments.js'
import advancedResults from '../middleware/advancedResults.js'
import Comment from '../models/Comment.js'
import { checkAuthToken } from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Comment), getComments)
    .post(checkAuthToken, createComment)

router.route('/:commentId')
    .get(getComment)
    .patch(checkAuthToken, updateComment)
    .delete(checkAuthToken, deleteComment)

export default router