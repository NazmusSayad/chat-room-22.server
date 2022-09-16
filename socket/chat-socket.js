const Chat = require('../model/Chat.js')

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

  constructor(io, socket, user) {
    this.#io = io
    this.#socket = socket
    this.#user = user

    console.log(
      `---> Connected with "${user.email}" from "${socket.handshake.address}"`
    )

    socket.on('message-initial', this.#sendInitialMessages)
    socket.on('message-getOlder', this.#getOlderMessagesThanId)
    socket.on('message-getNewer', this.#getNewerMessagesThanId)
    socket.on('message-delete', this.#deleteMessage)
    socket.on('message-new', this.#writeNewMessage)
    socket.on('disconnect', this.#onDisconnect)
  }

  #sendInitialMessages = async respond => {
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

  // HACK:BUG: Refactor this...
  #getNewerMessagesThanId = async (id, respond) => {
    try {
      const data = await Chat.getNewerMessagesThanId(id)
      if (data.length > 100) return respond(data.length)
      respond(data)
    } catch (err) {
      this.#disconnect(err)
    }
  }

  #deleteMessage = async (id, respond) => {
    try {
      await Chat.deleteMessage(this.#user.email, id)
      respond(true)
      this.#socket.broadcast.emit('message-delete', id)
    } catch (err) {
      this.#disconnect(err)
    }
  }

  #writeNewMessage = async (msgs, respond) => {
    try {
      const data = await Chat.writeMessage(this.#user.email, msgs)
      respond(data)
      this.#socket.broadcast.emit('message-new', data)
    } catch (err) {
      console.log(err)
      this.#disconnect(err)
    }
  }

  #disconnect = async (err = new Error('Something went wrong!')) => {
    this.#socket.emit('error', err.message)
    this.#socket.disconnect(true)
  }

  #onDisconnect = async () => {}
}
