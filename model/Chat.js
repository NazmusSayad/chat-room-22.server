const Model = require("./schema/chat-schema.js")
const { findUser } = require("./schema/user-schema.js")
const { RESPONSE_LIMIT, RESPONSE_LIMIT_OLD } = require("../.config.js")

const getLastMessages = async () => {
  const data = await Model.find().sort({ _id: -1 }).limit(RESPONSE_LIMIT)

  data.forEach((msg) => {
    msg._doc.name = findUser(msg.email).name
  })

  return data
}

const getOlderMessagesThanId = async (id) => {
  const data = await Model.find({ _id: { $lt: id } })
    .limit(RESPONSE_LIMIT_OLD)
    .sort({ _id: -1 })
  data.forEach((msg) => {
    msg._doc.name = findUser(msg.email).name
  })

  return data
}

const getNewerMessagesThanId = async (id) => {
  const data = await Model.find({ _id: { $gt: id } }).sort({ _id: 1 })
  data.forEach((msg) => {
    msg._doc.name = findUser(msg.email).name
  })

  return data
}

const writeMessage = async (email, msgs) => {
  throw new Error('Testing!')
  
  const userName = findUser(email).name

  const list = msgs.map((msg) => {
    return { sent: new Date(), email, msg }
  })

  const data = await Model.create(list)
  data.forEach((single) => {
    single._doc.name = userName
  })

  return data
}

module.exports = {
  getLastMessages,
  getOlderMessagesThanId,
  getNewerMessagesThanId,
  writeMessage,
}
