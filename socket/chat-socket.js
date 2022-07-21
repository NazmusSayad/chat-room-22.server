const Chat = require("../chat/chat.js")
const User = require("../user/user.js")

module.exports = async function (socket) {
  try {
    const io = this
    const user = User.getMatchedUser(
      socket?.handshake?.auth?.email,
      socket?.handshake?.auth?.password
    )

    const initialMessages = await Chat.getLastMessages()
    io.to(socket.id).emit("message-initial", initialMessages)
    console.log("initialMessages sent to " + user.email)
    // console.log(socket)

    socket.on("message-getOlder", async (id, respond) => {
      const data = await Chat.getOlderMessagesThanId(id)
      respond(data)
    })

    socket.on("message-getNewer", async (id, respond) => {
      const data = await Chat.getNewerMessagesThanId(id)
      if (data.length > 100) return respond(data.length)
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
    console.log(err)
    socket.emit("error", err.message)
    socket.disconnect()
  }
}
