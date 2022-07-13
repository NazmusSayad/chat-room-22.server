const mongoose = require("mongoose")
const Schema = new mongoose.Schema(
  {
    msg: {
      type: String,
      required: [true, "Message feild missing"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "User feild missing"],
      trim: true,
    },
    sent: {
      type: Date,
    },
  },
  {
    versionKey: false,
  }
)

module.exports = mongoose.model("Chat", Schema)
