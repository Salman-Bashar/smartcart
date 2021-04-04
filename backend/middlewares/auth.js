const User = require("../models/user")
const jwt = require("jsonwebtoken")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("./catchAsyncErrors")

//Check User Authentication
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies

  if (!token) return next(new ErrorHandler("Login Required", 401))

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded._id)

  next()
})

//Handle User Authorization
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new ErrorHandler("Unauthorized Access Denied", 401))

    next()
  }
}
