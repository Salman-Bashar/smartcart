const app = require("./app")
const dotenv = require("dotenv")
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
