const express = require("express")
const router = express.Router()

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
  updatePassword,
  logoutUser,
  getUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
} = require("../controllers/authController")

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)

router.route("/myprofile").get(isAuthenticatedUser, getUserProfile)
router.route("/myprofile/update").put(isAuthenticatedUser, updateProfile)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)

router.route("/logout").get(logoutUser)

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUsers)

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

module.exports = router
