const fs = require('fs')
const path = require('path')
fs.readFile( path.resolve(__dirname, 'a.txt') , (err, data) => {
  console.log(data);
  fs.writeFile(path.resolve(__dirname, 'b.txt'), "'1'", (err, data) => {
    console.log(err);
  })
})