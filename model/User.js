const Model = require("./schema/user-schema.js")

const newUser = async (body) => {
  body.email = body.email.toLowerCase()
  const data = await Model.createUser(body)
  return data
}

const getMatchedUser = (email, password) => {
  email = email.toLowerCase()

  if (!email || !password) throw new Error("Wrong input!")

  const userMatch = Model.findUser(email)
  if (!userMatch) {
    throw new Error("No account associated with this email.")
  }

  const passwordMatch = userMatch?.password === password
  if (!passwordMatch) {
    throw new Error("Wrong password!")
  }

  if (userMatch && passwordMatch) {
    return userMatch
  }

  throw new Error("Something went wrong!")
}

module.exports = { newUser, getMatchedUser }
