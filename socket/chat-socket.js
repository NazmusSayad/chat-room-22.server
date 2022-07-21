const Chat = require("../chat/chat.js")
const User = require("../user/user.js")

module.exports = async function (socket) {
  try {
    const io = this
    const { email, password } = socket?.handshake?.auth
    const user = User.getMatchedUser(email, password)

    // 1. Send most recent messages to client.
    io.to(socket.id).emit("message-recent", JSON.stringify(await Chat.getLastMessages()))

    socket.on("message-loadmore", async (id, respond) => {
      const res = await Chat.getOldMessageThanId(id)
      const resString = JSON.stringify(res)
      respond(resString)
    })

    socket.on("message-new", async (msg, respond) => {
      const res = await Chat.writeMessage(user.email, msg)
      const resString = JSON.stringify(res)
      socket.broadcast.emit("message-new", resString)
      respond(resString)
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
