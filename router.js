const express = require("express")

const app = require("./app.js")
const HelloWorld = require("./hello-world")
const { API_URL } = require("./.config.js")
const route = require("./routes/user-route.js")

/*
const { readMessage, writeMessage, readMessageById, readLastMessage } = require("./routes/chat-route.js")
const { getMatchedUser } = require("./model/User.js")
*/

const router = express.Router()
router.route("/user/:id").get(route.getUserPublicInfo)
router.route("/user").get(route.checkUser).post(route.createUser)

/*
router.route("/chat").get(readMessage).post(writeMessage)
router.route("/chats").get(readLastMessage)
router.route("/chats/:id").get(readMessageById)

app.use(API_URL, (req, res, next) => {
  try {
    if (req.url.startsWith("/user")) return next()

    getMatchedUser(req?.headers?.email, req?.headers?.password)
    next()
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
})
*/

app.use(API_URL, router)
app.use("/", (req, res) => HelloWorld(res))
