const getBooks = (req, res) => {
    res.send('Get all books')
}

const getBook = (req, res) => {
    res.send(`Get the book with ${req.params.id}`)
}

const createBook = (req, res) => {
    res.send('Create new Book')
}

const deleteBook = (req, res) => {
    res.send(`delete the book with ${req.params.id}`)
}

const updateBook = (req, res) => {
    res.send(`update the book with ${req.params.id}`)
}

export {
    getBooks,
    createBook,
    deleteBook,
    updateBook,
    getBook
}