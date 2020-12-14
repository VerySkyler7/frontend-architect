const fs = require('fs')
const path = require('path')

const rs = fs.createReadStream(path.resolve(__dirname, 'a.txt'))
const ws = fs.createWriteStream(path.resolve(__dirname, 'b.txt'))

rs.pipe(ws);
