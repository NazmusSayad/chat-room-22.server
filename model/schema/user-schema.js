const mongoose = require("mongoose")

const USER_LIST = {}
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name missing"],
      trim: true,
      minLength: [3, "User's name must be longer than 3 characters."],
      maxLength: [14, "User's name must be smaller than 3 characters."],
      match: [/^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$/, "Enter a valid name."],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password missing"],
      minLength: [6, "Password must be longer than 6 characters."],
      maxLength: [24, "Password must be smaller than 24 characters."],
    },
    dateJoin: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

// Add new model methods
const model = mongoose.model("User", Schema)
model.findUser = (query) => USER_LIST[query.toLowerCase()]
model.createUser = async (info) => {
  const data = await model.create({
    dateJoin: new Date(),
    ...info,
  })

  USER_LIST[data.email.toLowerCase()] = data
  return data
}

// Recieve old data and save
model.find((err, users) => {
  users.forEach((user) => {
    USER_LIST[user._id] = user
    USER_LIST[user.email.toLowerCase()] = USER_LIST[user._id]
  })

  console.log(">>> User list loaded...")
})

module.exports = model
