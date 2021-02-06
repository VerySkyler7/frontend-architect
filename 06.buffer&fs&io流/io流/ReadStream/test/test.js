const fs = require('fs')
const path = require('path')

const res = fs.createReadStream(path.resolve(__dirname, 'a.txt'), {
    flags: 'r',
    autoClose: true,
    highWaterMark: 1, // 分片读取  不填默认为64k
    start: 0, // 开始读的位置
    end: 10, // 读取结束的位置
})

res.on('open', function(fd) {
    console.log(fd);
});

const bufferArr = []

res.on('data', function(data) {
    debugger
    bufferArr.push(data)
})

res.on('end', function() {
    // const bures = Buffer.from(Buffer.concat(bufferArr))
    console.log(bufferArr)
    console.log(Buffer.concat(bufferArr))
    console.log(Buffer.concat(bufferArr).toString()); 
})

res.on('close', function(){
    console.log('close');
})