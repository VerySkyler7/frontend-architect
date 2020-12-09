const fs = require('fs')
const path = require('path')

const res = fs.createReadStream(path.resolve(__dirname, 'a.txt'), {
    flags: 'r',
    autoClose: true,
    highWaterMark: 3,
    start: 0,
    end: 11,
})

const rw = fs.createWriteStream(path.resolve(__dirname, 'b.txt'), {
    flags: 'w',
    emitClose: true,
    start: 0,
    highWaterMark: 1
})

res.on('data', function(data) {
    rw.write(data, 'utf-8', (err) => {
        err && console.log(err);
    })
})

