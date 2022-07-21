const fs = require("fs")

const script = fs.readFileSync(__dirname + "/script.js")
const style = fs.readFileSync(__dirname + "/style.css")
const html = fs
  .readFileSync(__dirname + "/index.html", "utf-8")
  .replace("/*[{(css)}]*/", style)
  .replace("/*[{(script)}]*/", script)

module.exports = (res) => {
  res.status(200).type("text/html").end(html)
}
