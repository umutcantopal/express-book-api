import express from 'express'
import dotenv from 'dotenv'
import booksRoutes from './routes/books.js'
import commentsRoutes from './routes/comments.js'
import connectDB from './config/db.js'
import errorHandler from './middleware/error.js'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: './config/config.env' })

connectDB()
const app = express()
// Body parser
app.use(express.json())

// file upload
app.use(fileUpload())

// static folder
// can access images in the browser with  {{path}}/uploads/image-name  Path
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

app.use('/api/v1/books', booksRoutes)
app.use('/api/v1/comments', commentsRoutes)

app.use(errorHandler)

const server = app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT} in ${NODE_ENV} mode`)
}) 

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err}`)
    server.close(() => process.exit(1))
})