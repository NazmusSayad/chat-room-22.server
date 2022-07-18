const mongoose = require("mongoose")
const User = require("./User.js")

const Schema = new mongoose.Schema(
  {
    msg: {
      type: String,
      required: [true, "Message feild missing"],
      trim: true,
    },
    email: {
      ...User.schema.obj.email,
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

module.exports = mongoose.model("Chat", Schema)
