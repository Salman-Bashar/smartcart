const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")

const errorMiddleware = require("./middlewares/errors")

//Setting up config file
dotenv.config({ path: "backend/config/config.env" })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload())

//Import all routes
const auth = require("./routes/auth")
const products = require("./routes/product")
const order = require("./routes/order")
const payment = require("./routes/payment")

app.use("/api", auth)
app.use("/api", products)
app.use("/api", order)
app.use("/api", payment)

//Middleware to handle errors
app.use(errorMiddleware)

module.exports = app
