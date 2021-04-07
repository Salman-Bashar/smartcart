const express = require("express")
const router = express.Router()

const {
  newOrder,
  getSingleOrder,
  getMyOrders,
  getAllOrders,
  processOrder,
  deleteOrder,
} = require("../controllers/orderController")

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.route("/order/new").post(isAuthenticatedUser, newOrder)

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder)

router.route("/orders/myorders").get(isAuthenticatedUser, getMyOrders)

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders)

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), processOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)

module.exports = router
