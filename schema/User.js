const mongoose = require("mongoose")
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name missing"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: "Email address is required",
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password missing"],
    },
    dateJoin: {
      type: Date,
    },
  },
  {
    versionKey: false,
  }
)

const USER_LIST = {}

// Add new model methods
const _model = mongoose.model("User", Schema)
_model.findUser = (email) => USER_LIST[email.toLowerCase()]
_model.createUser = async (info) => {
  const data = await _model.create({
    dateJoin: new Date(),
    ...info,
  })

  USER_LIST[data.email.toLowerCase()] = data
  return data
}

// Recieve old data and save
_model.find((err, users) => {
  users.forEach((user) => {
    USER_LIST[user.email.toLowerCase()] = user
  })
})

module.exports = _model
