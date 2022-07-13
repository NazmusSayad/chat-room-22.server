const express = require("express")
const { readMessage, writeMessage, readMessageById } = require("./routes/chat.js")
const { checkUser, createUser } = require("./routes/user.js")

const router = express.Router()
module.exports = router

router.route("/user").get(checkUser).post(createUser)
router.route("/user/:id").get(checkUser)
router.route("/chat").get(readMessage).post(writeMessage)
router.route("/chat/:id").get(readMessageById)
