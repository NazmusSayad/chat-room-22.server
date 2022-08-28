const mongoose = require("mongoose")
if (!process.env.DB) {
  throw new Error("Where is DATABASE token?")
}

mongoose
  .connect(process.env.DB)
  .then(() => console.log(">>> MongoDB connected successfully..."))
