import mongoose from "mongoose"
import slugify from "slugify"

// TODO updated_at, avg ratings
// TODO some field are related change them later
const BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    writer: { // later on change this. a book might have multiple writer.
        type: String,
        require: true
    },
    length: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    // TODO below field crashes app
    // genres: {
    //     tpye: [String],
    //     required: true,
    //     enum:  [
    //         'fantasy',
    //         'si-fi',
    //         'dystopian',
    //         'adventure',
    //         'mystery',
    //         'horror',
    //         'thriller',
    //         'historical',
    //         'autobiography',
    //         'art',
    //         'travel',
    //         'crime',
    //         'humor',
    //         'essays',
    //         'religion',
    //         'science'
    //     ]
    // },
    publishYear: {
        type: Date,
        required: true
    },
    publisher: String,
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    ISBN: {
        type: String,
        required: true,
        unique: true       
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

BookSchema.pre('save', function(next) {
    // TODO append a random number end of slug because there might be differen books with same name 
    this.slug = slugify(this.name, {
        lower: true
    })
    next()
})

const Book = mongoose.model('Book', BookSchema)
export default Book