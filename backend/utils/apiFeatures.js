class APIFeatures {
  constructor(query, queryStr) {
    ;(this.query = query), (this.queryStr = queryStr)
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {}

    this.query = this.query.find({ ...keyword })
    return this
  }

  filter() {
    const queryCopy = { ...this.queryStr }

    //Removing fields from the query
    const removeFields = ["keyword", "limit", "page"]
    removeFields.forEach((element) => delete queryCopy[element])

    //Advanced filter for price range, rating range etc.
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  pagination(productPerPage) {
    const currentPage = Number(this.queryStr.page) || 1
    const skip = productPerPage * (currentPage - 1)

    this.query = this.query.limit(productPerPage).skip(skip)
    return this
  }
}

module.exports = APIFeatures
