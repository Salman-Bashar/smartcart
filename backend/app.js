const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")

const errorMiddleware = require("./middlewares/errors")

app.use(express.json())
app.use(cookieParser())

//Import all routes
const auth = require("./routes/auth")
const products = require("./routes/product")
const order = require("./routes/order")

app.use("/api", auth)
app.use("/api", products)
app.use("/api", order)

//Middleware to handle errors
app.use(errorMiddleware)

module.exports = app
