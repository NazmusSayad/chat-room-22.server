const Schema = require("./Schema.js")
const { findUser } = require("../user/Schema.js")
const { RESPONSE_LIMIT, RESPONSE_LIMIT_OLD } = require("../.config.js")

const getLastMessages = async () => {
  const data = await Schema.find().sort({ _id: -1 }).limit(RESPONSE_LIMIT)

  data.forEach((msg) => {
    msg._doc.name = findUser(msg.email).name
  })

  return data
}

const getOlderMessagesThanId = async (id) => {
  const data = await Schema.find({ _id: { $lt: id } })
    .limit(RESPONSE_LIMIT_OLD)
    .sort({ _id: -1 })
  data.forEach((msg) => {
    msg._doc.name = findUser(msg.email).name
  })

  return data
}

const getNewerMessagesThanId = async (id) => {
  const data = await Schema.find({ _id: { $gt: id } }).sort({ _id: 1 })
  data.forEach((msg) => {
    msg._doc.name = findUser(msg.email).name
  })

  return data
}

const writeMessage = async (email, msg) => {
  const data = await Schema.create({
    sent: new Date(),
    email,
    msg,
  })
  data._doc.name = findUser(data.email).name

  return data
}

module.exports = { getLastMessages, getOlderMessagesThanId, getNewerMessagesThanId, writeMessage }
