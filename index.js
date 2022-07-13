console.clear()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const router = require("./router.js")
const User = require("./schema/User.js")
const app = express()

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  try {
    // Skip when SignUp/Login
    if (req.url.startsWith("/v1/api/user")) return next()

    const user = User.findUser(req.headers.email)
    if (user && user.password === req.headers.password) {
      return next()
    }

    throw new Error("Something went wrong!")
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
})
app.use("/v1/api", router)

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
