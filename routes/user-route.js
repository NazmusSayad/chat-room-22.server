const { findUser } = require("../model/schema/user-schema.js")
const User = require("../model/User.js")
const HelloWorld = require("../hello-world")

const getUserPublicInfo = (req, res) => {
  try {
    const query = req.params.id
    if (!query) throw new Error("Invalid query")

    const data = findUser(query)
    if (!data) throw new Error("No account associated with this query.")

    res.status(200).json({
      status: "success",
      data,
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    })
  }
}

const checkUser = (req, res) => {
  try {
    const { email, password } = req?.headers
    if (!email || !password) return HelloWorld(res)

    const data = User.getMatchedUser(email, password)

    res.status(200).json({
      status: "success",
      data,
    })
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    })
  }
}

const createUser = async (req, res) => {
  try {
    const data = await User.newUser(req.body)

    res.status(200).json({
      status: "success",
      data,
    })
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Another account associeted with this email."
    }

    res.status(404).json({
      status: "fail",
      message: err.message,
    })
  }
}

module.exports = { checkUser, createUser, getUserPublicInfo }
