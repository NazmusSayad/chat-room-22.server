const app = require("./app.js")

// Setup Server
const server = require("http").createServer(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
})

module.exports = { server, io }
