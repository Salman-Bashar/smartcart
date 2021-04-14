const User = require("../models/user")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")

const crypto = require("crypto")
const cloudinary = require("cloudinary")

//Register a User  =>  /api/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  })

  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
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
  const resetURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

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

//User Profile  =>  /api/myprofile
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user,
  })
})

//Change or Update Password  =>  /api/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password")

  //Check Old Password
  const isMatched = await user.comparePassword(req.body.oldPassword)

  if (!isMatched)
    return next(new ErrorHandler("Old password is incorrect", 400))

  user.password = req.body.password
  user.save()

  sendToken(user, 200, res)
})

//Update User Prifile  =>  /api/myprofile/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }

  //Update Avatar
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id)

    const image_id = user.avatar.public_id

    const res = await cloudinary.v2.uploader.destroy(image_id)

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    })

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
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

//Get all Users  =>  /api/admin/users
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    success: true,
    users,
  })
})

//Get User Details  =>   /api/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorHandler(`No user found with id: ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    user,
  })
})

//Update User Role  =>  /api/admin/user/:id
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    role: req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

//Delete User  =>  /api/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorHandler(`No user found with id: ${req.params.id}`, 404)
    )
  }

  //Remove Avatar from Cloud DB => TODO

  await user.remove()

  res.status(200).json({
    success: true,
  })
})
