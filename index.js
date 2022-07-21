console.clear()
require("dotenv").config()
const { server } = require("./server.js")

// Start Server
const port = process?.env?.PORT || 8080
server.listen(port, () => {
  console.log(`App running on port "${port}"...`)
})

require("./router.js")
require("./socket.js")
require("./database.js")
