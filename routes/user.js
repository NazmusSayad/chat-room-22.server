const User = require("../schema/User.js")

const getMatchedUser = ({ email, password }) => {
  if (!email || !password) throw new Error("Wrong input!")

  const userMatch = User.findUser(email)
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

const checkUser = (req, res) => {
  try {
    const data = getMatchedUser({
      email: req?.headers?.email,
      password: req?.headers?.password,
    })

    res.status(200).json({
      status: "success",
      data,
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

const createUser = async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase()
    const data = await User.createUser(req.body)

    res.status(200).json({
      status: "success",
      data,
    })
  } catch (error) {
    if (error.code === 11000) {
      error.message = "Another account associeted with this email."
    }

    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

module.exports = { getMatchedUser, checkUser, createUser }
