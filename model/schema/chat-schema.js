const emailSchema = require('./user-schema.js').schema.obj.email
const mongoose = require('mongoose')

const Schema = new mongoose.Schema(
  {
    msg: {
      type: String,
      trim: true,
    },
    files: [
      {
        type: String,
        trim: true,
      },
    ],
    email: {
      ...emailSchema,
      unique: false,
    },
    sent: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

module.exports = mongoose.model('Chat', Schema)
