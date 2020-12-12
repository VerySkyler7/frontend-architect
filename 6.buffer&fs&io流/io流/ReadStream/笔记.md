# fs.createReadStream
``` js
const fs = require('fs')
const path = require('path')

const res = fs.createReadStream(path.resolve(__dirname, 'a.txt'), {
    flags: 'r',
    autoClose: true,
    highWaterMark: 3, // 分片读取  官方推荐分片大小为64k比较合适
    start: 0,
    end: 11, 
})

res.on('open', function(fd) {
    console.log(fd);
});

const bufferArr = []

res.on('data', function(data) {
    bufferArr.push(data)
})

res.on('end', function() {
    console.log(Buffer.concat(bufferArr).toString()); 
})

res.on('close', function(){
    console.log('close');
})
```

# fs.createReadStream 源码分析
1. createReadStream 返回了一个ReadStream实例
2. ReadStream的原型继承了Readable的原型,同时继承了Readable的静态方法 