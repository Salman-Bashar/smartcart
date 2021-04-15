const Product = require("../models/product")
const ErrorHandler = require("../utils/errorHandler")
const APIFeatures = require("../utils/apiFeatures")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")

//Create a New Product  =>  /api/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id

  const product = await Product.create(req.body)

  res.status(201).json({
    success: true,
    product,
  })
})

//Show all Products to Regular User  =>  /api/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const productPerPage = 12
  const productCount = await Product.countDocuments()

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()

  let products = await apiFeatures.query
  let filteredProductCount = products.length

  apiFeatures.pagination(productPerPage)

  products = await apiFeatures.query

  res.status(200).json({
    success: true,
    productCount,
    productPerPage,
    filteredProductCount,
    products,
  })
})

//Show all Products to Admin User =>  /api/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find()

  res.status(200).json({
    success: true,
    products,
  })
})

//Show a Single Product Details  =>  /api/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) return next(new ErrorHandler("Product not found", 404))

  res.status(200).json({
    success: true,
    product,
  })
})

//Update a Product Details  =>  /api/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) return next(new ErrorHandler("Product not found", 404))

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    product,
  })
})

//Delete Product  =>   /api/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) return next(new ErrorHandler("Product not found", 404))

  product.delete()

  res.status(200).json({
    success: true,
    message: "Product deleted.",
  })
})

//Create & Update Product Review  =>  /api/product/review
exports.reviewProduct = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  }

  const product = await Product.findById(productId)

  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  )

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment
        review.rating = rating
      }
    })
  } else {
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length

  await product.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
  })
})

//Get Product Reviews  =>  /api/product/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId)

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  })
})

//Delete Product Review  =>  /api/product/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId)

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  )

  const numOfReviews = reviews.length

  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  )

  res.status(200).json({
    success: true,
  })
})
