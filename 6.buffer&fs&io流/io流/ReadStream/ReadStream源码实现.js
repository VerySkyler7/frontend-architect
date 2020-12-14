const fs = require('fs')
const path = require('path')
const EE = require('events')
const WriteStream = require('../WriteStream/WriteStream源码实现')

/**
 * 实现思路
 * 1. 继承events，能够使用订阅发布 open data end等
 * 2. 构造函数中：
 *  1. 参数默认初始化
 *  2. 调用open打开文件,emit open方法
 *  3. 监听newListener， 当用户订阅data事件时，触发_read方法
 * 3. 调用_read方法，使用fd进行读取文件。由于open的回调为异步，_read方法第一次拿不到fd，因此可以once一下open方法，当emit open时，重新运行_read即可拿到fd。
 * 4. 根据highWaterMark、start、end、bytesRead递归读取文件
 * 5. 当bytesRead为0时，emit end >> fs.close >> emit close
 * 6. 通过flowwing标识，控制_read方法的调用，实现pause和resume
 */
class ReadStream extends EE{
    constructor(path, options = {}) {
        super()
        this.path = path
        this.flags = options.flags || 'r'
        this.start = options.start || 0
        this.end = options.end
        this.autoClose = options.autoClose || true
        this.endcoding = options.endcoding
        this.highWaterMark = options.highWaterMark || 64 * 1024  // 默认是64k 性能应该是最优的
        this.offset = this.start; 
        this.flowwing = true;

        this.open();
        this.on('newListener', (type) => {
            if(type === 'data') {
                this._read()
            }
        })
    }

    pipe(ws) {
        this.on('data', (chunk) => {
            let r = ws.write(chunk);
            if(!r) this.pause(); // 如果r为true代表未超过ws的highWaterMark，可以继续往内存里写入
        })
        
        this.on('end', () => {
            ws.end();
        })
        
        ws.on('drain', () => {
            rs.resume();
        })
        
    }

    destroy(err) {
        if(err) {
            this.emit('error', err);
        }
        if(typeof this.fd === 'number' && this.autoClose) {
            fs.close(this.fd, () => {
                this.emit('close');
            });
        }
    }

    pause() {
      this.flowwing = false;
    }

    resume() {
      if(!this.flowwing) {
        this.flowwing = true;
        this.on('data', ()=>{}); // 或者 this._read() 都可以
      }
    }

    open() {
        fs.open(this.path, this.flags, (err, fd) => { // open 为异步，属于事件环中的poll
            if(err) this.destroy();
            this.fd = fd;
            this.emit('open', this.fd)
        })
    }

    _read() {
        if(typeof this.fd !== 'number') {
            // 由于open为异步执行，_read无法拿到open回调中的fd，因此在_read中once一下open，然后重新执行_read
            return this.once('open', () => this._read())
        }

        if(!this.flowwing) return;

        const buffer = Buffer.alloc(this.highWaterMark);
        // 如果end-start + 1 < hightWaterMark， 则取end-start+1作为fs.read里的length。加1是因为end-start比实际的length少1，所以要加1。
        const howMouchToRead = this.end === 0 ? Math.min(this.highWaterMark, this.end - this.offset + 1) : this.highWaterMark;
        fs.read(this.fd, buffer, 0, howMouchToRead, this.offset, (err, bytesRead) => {
            if(bytesRead > 0) {
                // 由于highWaterMark和end由人为指定，可能会比实际文件的字节要长，因此需要根据betesRead进行截取
                 this.emit('data', buffer.slice(0, bytesRead))
                 this.offset += howMouchToRead;
                 if(this.flowwing) {
                   this._read();
                 }
            }else {
                this.emit('end');
                this.destroy();
            }
        })
    }
}

// -------------------------代码测试-------------------------------
// const res = new ReadStream(path.resolve(__dirname, 'test/a.txt'), {
// const res = fs.createReadStream(path.resolve(__dirname, 'test/a.txt'), {
//     flags: 'r',
//     autoClose: true,
//     highWaterMark: 1, // 分片读取  不填默认为64k
//     start: 0, // 开始读的位置
//     end: 4, // 读取结束的位置
// })

// res.on('open', function(fd) {
//     console.log('fd', fd);
// });

// const bufferArr = []
// res.on('data', function(data) {
//   res.pause();
//   console.log(data);
//     bufferArr.push(data);
// })

// res.on('end', function() {
//     console.log(Buffer.concat(bufferArr).toString()); 
// })

// res.on('close', function(){
//     console.log('close');
// })

// setInterval(() => {
//   res.resume();
// }, 2000)

// -------------------------pipe测试-------------------------------
// const res = new ReadStream(path.resolve(__dirname, 'test/a.txt'))
// const ws = new WriteStream(path.resolve(__dirname, 'test/b.txt'))
// res.pipe(ws);