const app = require("./app")
const dotenv = require("dotenv")
const connectDB = require("./config/db")

//Setting up config file
dotenv.config({ path: "backend/config/config.env" })

//Database Connection
connectDB()

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  )
})
