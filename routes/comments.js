import express from 'express'
import { getComments, createComment, getComment, updateComment, deleteComment } from '../controllers/comments.js'
import advancedResults from '../middleware/advancedResults.js'
import Comment from '../models/Comment.js'

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Comment), getComments)
    .post(createComment)

router.route('/:commentId')
    .get(getComment)
    .patch(updateComment)
    .delete(deleteComment)

export default router