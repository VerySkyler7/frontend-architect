const fs = require('fs')
const path = require('path')

const res = fs.createReadStream(path.resolve(__dirname, 'a.txt'), {
    flags: 'r',
    highWaterMark: 1
})

res.on('data', (chunk) => {
    console.log(chunk);
})