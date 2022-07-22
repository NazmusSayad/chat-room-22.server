const Wait = function (duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

module.exports = { Wait }
