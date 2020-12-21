const fs = require('fs')
const path = require('path')

const rs = fs.createReadStream(path.resolve(__dirname, 'a.txt'))
const ws = fs.createWriteStream(path.resolve(__dirname, 'b.txt'))

rs.on('data', (chunk) => {
    let r = ws.write(chunk);
    if(!r) rs.pause(); // 如果r为true代表未超过ws的highWaterMark，可以继续往内存里写入
})

rs.on('end', () => {
    ws.end();
})

ws.on('drain', () => {
    rs.resume();
})

