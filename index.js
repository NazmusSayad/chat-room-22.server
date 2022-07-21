console.clear()
require("dotenv").config()
const { server } = require("./server")

// Connect with database!
const mongoose = require("mongoose")
if (!process.env.DATABASE_URL) {
  throw new Error("Where is DATABASE token?")
}
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connected successfully..."))

// Start Server
const port = process?.env?.PORT || 8080
server.listen(port, () => {
  console.log(`App running on port "${port}"...`)
})

// Start socket
require("./router.js")
require("./socket.js")
