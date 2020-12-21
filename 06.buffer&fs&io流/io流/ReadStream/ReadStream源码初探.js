const fs = require('fs')
const path = require('path')
const { Readable } = require('stream');

class MyReadStream extends Readable {
  _read() {
    let buffer = Buffer.alloc(3);
        fs.open(path.resolve(__dirname,'test/a.txt'),'r',(err,fd)=>{
            fs.read(fd,buffer,0,3,0,(er,bytesRead)=>{
                this.push(buffer); // 内部会自动触发emit('data',buffer) 将数据发射出来
                // 当监听了data事件后，会不停的触发_read方法，需要通过end事件终止
                this.push(null); // 此时如果push一个空值 会触发end事件 emit('end')
            })
        })
  }
}

const myRead = new MyReadStream()
myRead.on('data', function(chunk) { // 当用户监听了data事件后，会触发Readable.read方法，Readable会调用子类的_read方法
  console.log(chunk);
})

myRead.on('end',function () {
    console.log('end');
})
