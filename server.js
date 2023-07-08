import express from 'express'
import dotenv from 'dotenv'
import booksRoutes from './routes/books.js'

dotenv.config({ path: './config/config.env' })

const app = express()
const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

app.use('/api/v1/books', booksRoutes)

const server = app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT} in ${NODE_ENV} mode`)
}) 