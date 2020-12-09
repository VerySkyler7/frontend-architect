const fs = require('fs')
const path = require('path')

const alloc = Buffer.alloc(3);
fs.open(path.resolve(__dirname, 'a.txt'), 'r', (err, fd) => {
    fs.read(fd, alloc, 0, 3, 0, (err, bytesRead, buffer) => {
        console.log(bytesRead);
        console.log(buffer);
    })
})