const User = require("../models/user")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

//Register a User  =>  /api/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "demo-avatar-1",
      url: "https://unsplash.com/photos/C8Ta0gwPbQg",
    },
  })

  sendToken(user, 200, res)
})

//Login a User  =>   /api/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  //Check if User entered Email & Password or not
  if (!email || !password)
    return next(new ErrorHandler("Email & Password is required", 400))

  //Check if User exists
  const user = await User.findOne({ email }).select("+password")

  if (!user) return next(new ErrorHandler("Invalid Email or Password", 401))

  //check if Password is correct or not
  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid Email or Password", 401))

  sendToken(user, 200, res)
})

//Forgot Password  =>  /api/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) return next(new ErrorHandler("No user found with this email", 404))

  //Get Reset Password Token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  //Create Reset Password URL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`

  const message = `Your password reset token is as followed:\n\n${resetURL}\n\nPlease ignore if you have not requested this email.\nHave a nice day!\n\n\nRegards,\nSmartCart Team`

  try {
    await sendEmail({
      email: user.email,
      subject: "SmartCart Password Recovery",
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(error.message, 500))
  }
})

//Reset Password  =>  /api/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash URL Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invaid or has been expired",
        400
      )
    )
  }

  if (req.body.password !== req.body.confirmPassword)
    return next(new ErrorHandler("Password does not match", 400))

  //Set New Password
  user.password = req.body.password

  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendToken(user, 200, res)
})

//Logout a User  =>  /api/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Logged Out",
  })
})
