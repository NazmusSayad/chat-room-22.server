const mongoose = require("mongoose")
if (!process.env.DATABASE_URL) {
  throw new Error("Where is DATABASE token?")
}

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connected successfully..."))