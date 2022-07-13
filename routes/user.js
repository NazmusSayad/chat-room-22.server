const User = require("../schema/User.js")

exports.checkUser = async (req, res) => {
  try {
    const data = User.findUser(req?.headers?.email)

    if (!data) throw new Error("User not found!")
    if (data?.password === req?.headers?.password) {
      return res.status(200).json({
        status: "success",
        data,
      })
    }

    throw new Error("Auth Failed!")
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

exports.createUser = async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase()
    const data = await User.createUser(req.body)

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
