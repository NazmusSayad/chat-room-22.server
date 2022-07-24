const { io } = require("./server.js")
const { API_URL } = require("./.config.js")
const Client = require("./socket/chat-socket.js")
const User = require("./model/User.js")

io.on("connection", (socket) => socket.disconnect())

const chatIo = io.of(API_URL + "/chat")
chatIo.on("connection", async (socket) => {
  // if (!User.userLoaded) await User.waitForUserLoading()

  try {
    const user = User.getMatchedUser(
      socket?.handshake?.auth?.email,
      socket?.handshake?.auth?.password
    )

    new Client(chatIo, socket, user)
  } catch {
    socket.disconnect()
  }
})
