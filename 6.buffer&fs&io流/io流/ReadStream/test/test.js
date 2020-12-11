const fs = require('fs')
const path = require('path')
const buffer = Buffer.alloc(3)
fs.open(path.resolve(__dirname, 'a.txt'), 'r', (err, fd) => {
  fs.read(fd, buffer, 0, 3, 0, (err, bytesRead) => {
    console.log(buffer);
  })
})

// const res = fs.createReadStream(path.resolve(__dirname, 'a.txt'), {
//     flags: 'r',
//     highWaterMark: 1
// })

// res.on('data', (chunk) => {
//     console.log(chunk);
// })