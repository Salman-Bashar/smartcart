const app = require("./app")
const dotenv = require("dotenv")
const cloudinary = require("cloudinary")
const connectDB = require("./config/db")

//Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`)
  console.log("Shutting down due to uncaught rejection")

  process.exit(1)
})

//Setting up config file
dotenv.config({ path: "backend/config/config.env" })

//Database Connection
connectDB()

//Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  )
})

//Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`)
  console.log("Server is shutting down due to unhandled promise rejection")

  server.close(() => {
    process.exit(1)
  })
})
