import express from 'express'
import { getComments, createComment, getComment, updateComment, deleteComment } from '../controllers/comments.js'

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(getComments)
    .post(createComment)

router.route('/:commentId')
    .get(getComment)
    .patch(updateComment)
    .delete(deleteComment)

export default router