const { io } = require("./server.js")
const { API_URL } = require("./.config.js")
const chatSocket = require("./socket/chat-socket.js")

io.on("connection", (socket) => socket.disconnect())
const chatIo = io.of(API_URL + "/chat")
chatIo.on("connection", chatSocket)
