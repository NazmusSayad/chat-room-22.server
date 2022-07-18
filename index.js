console.clear()
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const router = require("./router.js")
const User = require("./schema/User.js")
const { API_URL } = require("./CONFIG.js")
const { getMatchedUser } = require("./routes/user.js")
const app = express()

app.use(cors())
app.use(express.json())
app.use(API_URL, (req, res, next) => {
  try {
    if (req.url.startsWith("/user")) return next()

    getMatchedUser({
      email: req?.headers?.email,
      password: req?.headers?.password,
    })

    next()
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
})
app.use(API_URL, router)

// Connect With DataBase
if (!process.env.DATABASE_URL) {
  throw new Error("Where is DATABASE TOKEN?")
}

const DB = process.env.DATABASE_URL
mongoose.connect(DB).then(() => console.log("MongoDB connected!"))

// Start Server
const port = process?.env?.PORT || 80
app.listen(port, () => {
  console.log(`App running on port "${port}"...`)
})
