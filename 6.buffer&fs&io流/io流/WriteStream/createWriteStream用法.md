老师  
当第一次调用ws.write() 返回false时，代表已经达到预期，第二次再调用ws.write()则写入到内存中

当第一次调用ws.write()返回true时，代表还没达到预期，但此时再调用ws.write()也照这样会写入到内存对吗

也就是说是否写入到内存中和返回的true还是false没有关系  主要和第几次调用有关系

# fs.createWriteStream
``` js
const fs = require('fs')
const path = require('path')

const ws = fs.createWriteStream(path.resolve(__dirname, 'copy.md'), {
  flags: 'w', // 默认为w，通过w打开文件时，会把文件先清空。如果为a则是在原有基础上追加
  emitClose: true, // 默认为true
  autoClose: true, // 默认为true
  encoding: 'utf-8', // 默认为utf-8
  start: 0, // 默认为0
  // 默认为 16 * 1024  这是一个期望值，即使写入的内容大于highWaterMark也会按实际内容写入，
  // 但写入的内容大于等于highWaterMark，write方法会返回false
  highWaterMark: 4, 
  mode: 0o666, // 默认为0o666
})

// 返回值r为boolean型，代表的是ws的所有write的字节数之和否小于highWaterMark
// write方法第一个参数只能是字符串或者buffer
let r = ws.write('1', (err) => {
  if(err) console.log(err);
})
console.log(r);
// 重要
// write方法时有序的，它是个异步方法，但是会按顺序执行，结果永远是1234。(重要)并且首次write是直接写入文件，之后的write是写入到内存中以链表的形式有序存放(？？这里是否不区分是哪个ws)。
// 针对单个ws，每次write再上一个write的基础上进行追加，fs.write如果没标明写入的start，则每次是覆盖操作
r = ws.write('234');
console.log(r);
```

# 通过一个字节将10个数写入到文件中
``` js
const fs = require('fs')
const path = require('path')

const ws = fs.createWriteStream(path.resolve(__dirname, 'copy.md'), {
  highWaterMark: 1, 
  autoClose: true,
})

let i = 0;

function write() {
  while(i < 10) {
    const res = ws.write(i++ + '');
    if(!res) {
      break;
    }
  }
  if(i === 10) { 
    // 1. close事件，需要通过end方法进行触发
    // 2. end方法需要写到write之后，end后不可以继续write
    // 3. end后不会再触发drain事件，因此drain会被触发9次
    ws.end('END');
  }
}

ws.on('drain', () => { // 重要 当一个批次的ws.write的数据总长度达到highWaterMark并被消费后会触发drain(也是是ws.write返回false时，会触发该事件)
  console.log(i + '我达到了highWaterMark');
  write();
})

write();

ws.on('close', () => {
  console.log('close');
})
```

# createReadStream和createWriteStream结合使用
- 通过readStream读出文件一个chunk，writeStream将chunk进行拆分，按照highWaterMark进行写入，达到highWaterMark则暂停写入，之前的都写完后触发drain，通过drain继续写入chunk剩余的片段，以此周而复始执行。