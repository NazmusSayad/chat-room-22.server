const Chat = require("../chat/chat.js")
const User = require("../user/user.js")

module.exports = async function (socket) {
  try {
    const io = this
    const { email, password } = socket?.handshake?.auth
    const user = User.getMatchedUser(email, password)

    const initialMessages = await Chat.getLastMessages()
    io.to(socket.id).emit("message-initial", initialMessages)

    socket.on("message-loadmore", async (id, respond) => {
      const data = await Chat.getOldMessageThanId(id)
      respond(data)
    })

    socket.on("message-new", async (msg, respond) => {
      console.log(msg)

      const data = await Chat.writeMessage(user.email, msg)
      socket.broadcast.emit("message-new", data)
      respond(data)
    })

    /* 
    socket.on("message-edit", async (data, respond) => {})
    socket.on("message-delete", async (data, respond) => {})
    socket.on("disconnect", () => {}) 
    */
  } catch (err) {
    socket.emit("error", err.message)
    socket.disconnect()
  }
}
