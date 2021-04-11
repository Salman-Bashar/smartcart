const express = require("express")
const router = express.Router()

const {
  getProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
  deleteProduct,
  reviewProduct,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController")

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct)

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)

router.route("/products").get(getProducts)

router.route("/product/review").put(isAuthenticatedUser, reviewProduct)
router
  .route("/product/reviews")
  .get(isAuthenticatedUser, getProductReviews)
  .delete(isAuthenticatedUser, deleteReview)

router.route("/product/:id").get(getSingleProduct)

module.exports = router
