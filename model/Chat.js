const Schema = require("./schema/chat-schema.js")
const User = require("./User.js")
const { RESPONSE_LIMIT, RESPONSE_LIMIT_OLD } = require("../.config.js")

const addNameToMessages = (messages) => {
  messages.forEach((msg) => {
    msg._doc.name = User.getUserName(msg.email)
  })
  return messages
}

const getLastMessages = async () => {
  const data = await Schema.find().sort({ _id: -1 }).limit(RESPONSE_LIMIT)
  return addNameToMessages(data)
}

const getOlderMessagesThanId = async (id) => {
  const data = await Schema.find({ _id: { $lt: id } })
    .limit(RESPONSE_LIMIT_OLD)
    .sort({ _id: -1 })
  return addNameToMessages(data)
}

const getNewerMessagesThanId = async (id) => {
  const data = await Schema.find({ _id: { $gt: id } }).sort({ _id: 1 })
  return addNameToMessages(data)
}

const writeMessage = async (email, msgs) => {
  const list = msgs.map((msg) => {
    return { sent: new Date(), email, msg }
  })

  const data = await Schema.create(list)
  return addNameToMessages(data)
}

module.exports = {
  getLastMessages,
  getOlderMessagesThanId,
  getNewerMessagesThanId,
  writeMessage,
}
