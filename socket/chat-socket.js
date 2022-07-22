const Chat = require("../model/Chat.js")
const User = require("../model/User.js")

const sendInitialMessages = async (respond) => {
  try {
    const data = await Chat.getLastMessages()
    respond(data)
  } catch (err) {
    throw err
  }
}

const getOlderMessagesThanId = async (id, respond) => {
  try {
    const data = await Chat.getOlderMessagesThanId(id)
    respond(data)
  } catch (err) {
    throw err
  }
}

const getNewerMessagesThanId = async (id, respond) => {
  try {
    const data = await Chat.getNewerMessagesThanId(id)
    if (data.length > 100) return respond(data.length)
    respond(data)
  } catch (err) {
    throw err
  }
}

const writeNewMessage = async function (msgs, respond) {
  try {
    const data = await Chat.writeMessage(this.email, msgs)
    socket.broadcast.emit("message-new", data)
    respond(data)
  } catch (err) {
    throw err
  }
}

const onDisconnect = () => {}

module.exports = async function (socket) {
  try {
    const user = User.getMatchedUser(
      socket?.handshake?.auth?.email,
      socket?.handshake?.auth?.password
    )

    console.log(`---> Connected with "${user.email}"`)

    socket.on("message-initial", sendInitialMessages.bind(user))
    socket.on("message-getOlder", getOlderMessagesThanId.bind(user))
    socket.on("message-getNewer", getNewerMessagesThanId.bind(user))
    socket.on("message-new", writeNewMessage.bind(user))
    socket.on("disconnect", onDisconnect)

    /* 
    socket.on("message-edit", async (data, respond) => {})
    socket.on("message-delete", async (data, respond) => {})
    */
  } catch (err) {
    socket.emit("error", err.message)
    socket.disconnect()
  }
}
