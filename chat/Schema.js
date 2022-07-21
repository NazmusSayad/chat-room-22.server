const emailSchema = require("../user/Schema.js").schema.obj.email
const mongoose = require("mongoose")

const Schema = new mongoose.Schema(
  {
    msg: {
      type: String,
      required: [true, "Message feild missing"],
      trim: true,
    },
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

module.exports = mongoose.model("Chat", Schema)
