const express = require("express")

const app = require("./app.js")
const { API_URL } = require("./.config.js")
const { readMessage, writeMessage, readMessageById, readLastMessage } = require("./routes/chat.js")
const { checkUser, createUser } = require("./routes/user.js")
const { getMatchedUser } = require("./user/user.js")

const router = express.Router()
router.route("/user").get(checkUser).post(createUser)
router.route("/user/:id").get(checkUser)
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
app.use(API_URL, router)
