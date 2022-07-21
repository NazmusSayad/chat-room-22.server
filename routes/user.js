const model = require("../user/user.js")

const checkUser = (req, res) => {
  try {
    const data = model.getMatchedUser(req?.headers?.email, req?.headers?.password)

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
    const data = await model.newUser(req.body)

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

module.exports = { checkUser, createUser }
