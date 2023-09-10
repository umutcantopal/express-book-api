const advancedResults = (model) => async (req, res, next) => {
    const requestQuery = { ...req.query }
    const removeFields = ['sort', 'select', 'page', 'limit', 'populate']
    removeFields.forEach(param => delete requestQuery[param])

    let queryStr = JSON.stringify(requestQuery)

    // filtering
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

    let query = model.find(JSON.parse(queryStr))

    // sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }

    // selecting fields
    if (req.query.select) {
        const selectedFields = req.query.select.split(',').join(' ')
        query = query.select(selectedFields)
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const skipDocumentNum = (page - 1) * limit
    const endIndex = page * limit
    const totalCount = await model.countDocuments()

    const paginationInfo = {}

    if (totalCount > endIndex) {
        paginationInfo.next = {
            page: page + 1,
            limit
        }
    }

    if (skipDocumentNum > 0) {
        paginationInfo.prev = {
            page: page - 1,
            limit
        }
    }

    query = query.skip(skipDocumentNum).limit(limit)

    // populate
    if (req.query.populate) {
        query = query.populate(req.query.populate)
    }
    
    const results = await query

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination: paginationInfo,
        data: results
    }

    next()
}

export default advancedResults