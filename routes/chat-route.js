const Chat = require("../model/Chat.js")
const pendingReqRes = []

exports.readMessage = async (req, res) => {
  try {
    pendingReqRes.push({ req, res, time: Date.now() })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

exports.readLastMessage = async (req, res) => {
  try {
    const data = await Chat.getLastMessages()
    if (!data.length) throw new Error("No message found")

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
    const data = await Chat.getOlderMessagesThanId(req.params.id)
    if (!data.length) throw new Error("No message found")

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
    const data = await Chat.writeMessage(req.headers.email, req.body.msg)

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

throw new Error("I am not in service!")
