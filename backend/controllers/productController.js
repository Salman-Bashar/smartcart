const Product = require("../models/product")

//Create a New Product  =>  /api/admin/product/new
exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body)

  res.status(201).json({
    success: true,
    product,
  })
}

//Show all Products from Database  =>  /api/products
exports.getProducts = async (req, res, next) => {
  const products = await Product.find()

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  })
}

//Show a Single Product Details from Database  =>  /api/product/:id
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product not found.",
    })
  }

  res.status(200).json({
    success: true,
    product,
  })
}

//Update a Product Details  =>  /api/admin/product/:id
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    })
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    product,
  })
}

//Delete Product  =>   /api/admin/product/:id
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    })
  }

  product.delete()

  res.status(200).json({
    success: true,
    message: "Prudct deleted.",
  })
}
