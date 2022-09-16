const cloudinary = require('cloudinary')
const Schema = require('./schema/chat-schema.js')
const User = require('./User.js')
const { RESPONSE_LIMIT, RESPONSE_LIMIT_OLD } = require('../.config.js')

cloudinary.v2.config({
  cloud_name: process.env.C_COULD_NAME,
  api_secret: process.env.C_API_SECRET,
  api_key: process.env.C_API_KEY,
})

const addNameToMessages = messages => {
  messages.forEach(msg => {
    msg._doc.name = User.getUserName(msg.email)
  })
  return messages
}

const getLastMessages = async () => {
  const data = await Schema.find().sort({ _id: -1 }).limit(RESPONSE_LIMIT)
  return addNameToMessages(data)
}

const getOlderMessagesThanId = async id => {
  const data = await Schema.find({ _id: { $lt: id } })
    .limit(RESPONSE_LIMIT_OLD)
    .sort({ _id: -1 })
  return addNameToMessages(data)
}

const getNewerMessagesThanId = async id => {
  const data = await Schema.find({ _id: { $gt: id } }).sort({ _id: 1 })
  return addNameToMessages(data)
}

const deleteMessage = async (email, id) => {
  const data = await Schema.findById(id)
  if (data.email !== email) throw new Error('Wrong user!')

  const filesPublicId = data.files.map(file => {
    return file.split('/').at(-1).match(/^\w*/)[0]
  })

  const deletionPromises = [data.delete()]
  if (filesPublicId.length) {
    deletionPromises.push(cloudinary.v2.api.delete_resources(filesPublicId))
  }

  await Promise.all(deletionPromises)
  return true
}

const writeMessage = async (email, msgs) => {
  const list = msgs.map(msg => {
    if (!(msg.msg || msg.files.length)) {
      throw new Error('Invalid message')
    }

    return {
      sent: new Date(),
      email,
      ...msg,
    }
  })

  const data = await Schema.create(list)
  return addNameToMessages(data)
}

module.exports = {
  getLastMessages,
  getOlderMessagesThanId,
  getNewerMessagesThanId,
  deleteMessage,
  writeMessage,
}
