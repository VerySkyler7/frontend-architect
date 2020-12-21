module.exports = function (id) {
  const path = require('path')
  console.log(path.resolve(__dirname, id))
}