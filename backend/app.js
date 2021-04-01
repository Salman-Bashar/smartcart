const express = require("express")
const app = express()

const errorMiddleware = require("./middlewares/errors")

app.use(express.json())

//Import all routes
const products = require("./routes/product")

app.use("/api", products)

//Middleware to handle errors
app.use(errorMiddleware)

module.exports = app
