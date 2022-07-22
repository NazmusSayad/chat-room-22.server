const Chat = require("../model/Chat.js")
const User = require("../model/User.js")

module.exports = async function (socket) {
  try {
    const user = User.getMatchedUser(
      socket?.handshake?.auth?.email,
      socket?.handshake?.auth?.password
    )

    socket.on("message-initial", async (respond) => {
      const data = await Chat.getLastMessages()
      respond(data)
    })

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
      const data = await Chat.writeMessage(user.email, msg)
      socket.broadcast.emit("message-new", data)
      respond(data)
    })

    socket.on("messages-new", async (msgs, respond) => {
      const data = await Chat.writeMessages(user.email, msgs)
      socket.broadcast.emit("messages-new", data)
      respond(data)
    })

    /* 
    socket.on("message-edit", async (data, respond) => {})
    socket.on("message-delete", async (data, respond) => {})
    */
    socket.on("disconnect", () => {
      console.log(socket)
    })
  } catch (err) {
    console.log(err)
    socket.emit("error", err.message)
    socket.disconnect()
  }
}
