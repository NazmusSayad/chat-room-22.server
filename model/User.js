const Schema = require("./schema/user-schema.js")

const newUser = async (body) => {
  body.email = body.email.toLowerCase()
  const data = await Schema.createUser(body)
  return data
}

const getMatchedUser = (email, password) => {
  email = email.toLowerCase()

  if (!email || !password) throw new Error("Wrong input!")

  const userMatch = Schema.findUser(email)
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

const getUserName = (email) => Schema.findUser(email)?.name

const waitForUserLoading = () =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      if (Schema._userListLoaded) {
        resolve(null)
        clearInterval(interval)
      }
    }, 50)
  })

module.exports = {
  newUser,
  getMatchedUser,
  getUserName,
  userLoaded: Schema._userListLoaded,
  waitForUserLoading,
}
