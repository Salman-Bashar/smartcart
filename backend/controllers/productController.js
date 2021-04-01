const Product = require("../models/product")
const ErrorHandler = require("../utils/errorHandler")
const APIFeatures = require("../utils/apiFeatures")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")

//Create a New Product  =>  /api/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body)

  res.status(201).json({
    success: true,
    product,
  })
})

//Show all Products from Database  =>  /api/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const productPerPage = 2
  const productCount = await Product.countDocuments()

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(productPerPage)

  const products = await apiFeatures.query

  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    products,
  })
})

//Show a Single Product Details from Database  =>  /api/product/:id
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
    message: "Prudct deleted.",
  })
})
