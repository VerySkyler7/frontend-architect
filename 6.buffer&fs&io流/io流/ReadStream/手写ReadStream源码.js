const fs = require('fs')
const path = require('path')
const { Readable } = require('stream');

class MyReadStream extends Readable {
  _read() {
    let buffer = Buffer.alloc(3);
        fs.open(path.resolve(__dirname,'a.txt'),'r',(err,fd)=>{
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


// const { Readable } = require('stream'); // 可读流接口
// const fs = require('fs');
// const path = require('path');
// // Readable.prototype.read  父类实现的  父类里面有一个read方法
// // 我要自定义一个可读流

// // fs.createReadStream 只是重写了_read方法
// // 文件可读流 和 流的区别
// class MyReadStream extends Readable {
//     _read(){
//         let buffer = Buffer.alloc(3);
//         fs.open(path.resolve(__dirname,'a.txt'),'r',(err,fd)=>{
//             fs.read(fd,buffer,0,3,0,(er,bytesRead)=>{
//                 this.push(buffer); // 内部会自动触发emit('data',buffer) 将数据发射出来
//                 this.push(null); // 此时如果push一个空值 会触发end事件 emit('end')
//             })
//         })
//         // fs.readFile
//     }
// }
// let myStream = new MyReadStream()
// myStream.on('data',function (chunk) { // 当用户监听了data事件后 会触发Readable.read方法，父类会调用子类自己实现的_read方法, 当监听事件后会不停的触发_read方法
//     console.log(chunk);
// })
// myStream.on('end',function () {
//     console.log('end');
// })