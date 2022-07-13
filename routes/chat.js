const Chat = require("../schema/Chat.js")
const { findUser } = require("../schema/User.js")
const RESPONSE_LIMIT = 10
const RESPONSE_LIMIT_OLD = 5
const RESPONSE_TIMEOUT = 3000 // MS
const pendingReqRes = []

exports.readMessage = async (req, res) => {
  try {
    if (req.headers.instant !== "1") {
      return pendingReqRes.push({ req, res, time: Date.now() }), console.log(pendingReqRes.length)
    }

    const data = await Chat.find().sort({ _id: -1 }).limit(RESPONSE_LIMIT)

    data.forEach((msg) => {
      msg._doc.name = findUser(msg.email).name
    })

    if (!data.length) throw new Error("No message found")

    // end: send reesponse
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

exports.readMessageById = async (req, res) => {
  try {
    const data = await Chat.find({ _id: { $lt: req.params.id } })
      .limit(RESPONSE_LIMIT_OLD)
      .sort({ _id: -1 })

    data.forEach((msg) => {
      msg._doc.name = findUser(msg.email).name
    })

    if (!data.length) throw new Error("No message found")

    // end: send reesponse
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

exports.writeMessage = async (req, res) => {
  try {
    const data = await Chat.create({
      sent: new Date(),
      email: req.headers.email,
      msg: req.body.msg,
    })
    data._doc.name = findUser(data.email).name

    const operatorList = [...pendingReqRes]
    pendingReqRes.length = 0

    operatorList.forEach((item) => {
      if (item.req.headers.email === req.headers.email) {
        return pendingReqRes.push(item)
      }

      item.res.status(200).json({
        status: "success",
        data,
      })
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
