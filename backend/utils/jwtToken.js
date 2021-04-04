//Create, Send & Save JWT Token in Cookie
const sendToken = (user, statusCode, res) => {
  //Create JWT Token
  const token = user.getJWTToken()

  //Cookie Options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIARY_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  })
}

module.exports = sendToken
