const express = require("express")
const router = express.Router()

const {
  getProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController")

router.route("/admin/product/new").post(newProduct)
router.route("/admin/product/:id").put(updateProduct).delete(deleteProduct)

router.route("/products").get(getProducts)
router.route("/product/:id").get(getSingleProduct)

module.exports = router
