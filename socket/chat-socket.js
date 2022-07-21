const Chat = require("../chat/chat.js")
const User = require("../user/user.js")

module.exports = async function (socket) {
  try {
    const io = this
    // const user = {
    //   _id: "62d9d01feb593c012734201f",
    //   name: "Test Sayad",
    //   email: "247sayad@gmail.com",
    //   password: "zwzNcBhdMA9FPKV",
    //   dateJoin: "2022-07-21T22:15:59.059Z",
    // }

    const user = User.getMatchedUser(
      socket?.handshake?.auth?.email,
      socket?.handshake?.auth?.password
    )

    require("fs").writeFileSync("./data.json", JSON.stringify(user))

    const initialMessages = await Chat.getLastMessages()
    io.to(socket.id).emit("message-initial", initialMessages)

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
      console.log("I got something")

      const data = await Chat.writeMessages(user.email, msgs)
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
