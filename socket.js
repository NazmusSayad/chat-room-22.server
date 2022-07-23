const { io } = require("./server.js")
const { API_URL } = require("./.config.js")
const Client = require("./socket/chat-socket.js")

io.on("connection", (socket) => socket.disconnect())
const chatIo = io.of(API_URL + "/chat")
chatIo.on("connection", (socket) => new Client(chatIo, socket))
