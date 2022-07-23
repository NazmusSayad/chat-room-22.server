const Chat = require("../model/Chat.js")
const User = require("../model/User.js")

module.exports = class Client {
  #io = null
  #socket = null
  #user = {
    _id: null,
    name: null,
    email: null,
    password: null,
    dateJoin: null,
  }

  constructor(io, socket) {
    this.#io = io
    this.#socket = socket

    try {
      this.#user = User.getMatchedUser(
        socket?.handshake?.auth?.email,
        socket?.handshake?.auth?.password
      )

      console.log(`---> Connected with "${this.#user.email}" from "${socket.handshake.address}"`)

      socket.on("message-initial", this.#sendInitialMessages)
      socket.on("message-getOlder", this.#getOlderMessagesThanId)
      socket.on("message-getNewer", this.#getNewerMessagesThanId)
      socket.on("message-new", this.#writeNewMessage)
      socket.on("disconnect", this.#onDisconnect)
    } catch (err) {
      this.#disconnect()
    }
  }

  #sendInitialMessages = async (respond) => {
    try {
      const data = await Chat.getLastMessages()
      respond(data)
    } catch (err) {
      this.#disconnect(err)
    }
  }

  #getOlderMessagesThanId = async (id, respond) => {
    try {
      const data = await Chat.getOlderMessagesThanId(id)
      respond(data)
    } catch (err) {
      this.#disconnect(err)
    }
  }

  #getNewerMessagesThanId = async (id, respond) => {
    try {
      const data = await Chat.getNewerMessagesThanId(id)
      if (data.length > 100) return respond(data.length)
      respond(data)
    } catch (err) {
      this.#disconnect(err)
    }
  }

  #writeNewMessage = async (msgs, respond) => {
    try {
      const data = await Chat.writeMessage(this.#user.email, msgs)
      this.#socket.broadcast.emit("message-new", data)
      respond(data)
    } catch (err) {
      this.#disconnect(err)
    }
  }

  #disconnect = async (err = new Error("Something went wrong!")) => {
    this.#socket.emit("error", err.message)
    this.#socket.disconnect()
  }

  #onDisconnect = async () => {}
}
