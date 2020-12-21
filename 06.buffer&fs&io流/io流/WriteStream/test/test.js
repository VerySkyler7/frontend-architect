const fs = require('fs')
const path = require('path')

const ws = fs.createWriteStream(path.resolve(__dirname, 'copy.md'), {
  highWaterMark: 2, 
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

ws.on('drain', () => { // 当ws.write的数据写入到文件后，会触发drain
  console.log(i + '我达到了highWaterMark并将ws.write的数据写入到文件中了');
  write();
})

write();

ws.on('close', () => {
  console.log('close');
})