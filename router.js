const express = require("express")

const app = require("./app.js")
const route = require("./routes/user-route.js")
const User = require("./model/User.js")
const HelloWorld = require("./hello-world")
const { API_URL } = require("./.config.js")

const router = express.Router()
router.route("/user/:id").get(route.getUserPublicInfo)
router.route("/user").get(route.checkUser).post(route.createUser)

app.use("/", async (req, res, next) => {
  if (!User.userLoaded) await User.waitForUserLoading()
  next()
})
app.use(API_URL, router)
app.use("/", (req, res) => HelloWorld(res))
