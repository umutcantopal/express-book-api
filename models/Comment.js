import mongoose from "mongoose"
import User from "./User.js"

const CommentSchema = new mongoose.Schema({
    // TODO don't have user model yet
    // user
    comment: {
        type: String,
        required: false
    },
    book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'comment min value cannot be less than 1'],
        max: [10, 'comment min value cannot be more than 10']
    },
    visible: {
        type: Boolean,
        required: true,
        default: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
    // TODO add like and dislike
    // TODO one user one comment for a book
})

const Comment = mongoose.model('Comment', CommentSchema)

export default Comment