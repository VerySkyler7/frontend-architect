const fs = require('fs')
const path = require('path')
const EE = require('events')

/**
 * 实现思路
 * 1. 继承events，能够使用订阅发布 open data end等
 * 2. 参数默认初始化
 * 3. 调用open打开文件,emit open方法
 * 4. 调用open后立马调用_read读取文件
 * 5. 根据highWaterMark、start、end、bytesRead递归读取文件
 */
class ReadStream extends EE{
    constructor(path, options = {}) {
        super()
        this.path = path
        this.flags = options.flags
        this.start = options.start || 0
        this.end = options.end
        this.autoClose = options.autoClose || true
        this.endcoding = options.endcoding
        this.highWaterMark = options.highWaterMark || 64 * 1024  // 默认是64k 性能应该是最优的
        this.offset = this.start; 

        this.open()
        this.on('newListener', (type) => {
            if(type === 'data') {
                this._read()
            }
        })
    }

    destroy(err) {
        if(err) {
            this.emit('error', err);
        }
    }

    open() {
        fs.open(this.path, this.flags, (err, fd) => {
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
        const buffer = Buffer.alloc(this.highWaterMark);
        // 如果end-start < hightWaterMark， 则取end-start作为fs.read里的length。
        const howMouchToRead = this.end ? Math.min(this.highWaterMark, this.end - this.offset + 1) : this.highWaterMark;
        fs.read(this.fd, buffer, 0, howMouchToRead, this.offset, (err, bytesRead) => {
            if(bytesRead > 0) {
                // 由于highWaterMark和end由人为指定，可能会比实际文件的字节要长，因此需要根据betesRead进行截取
                 this.emit('data', buffer.slice(0, bytesRead))
                 this.offset += howMouchToRead;
                 this._read();
            }else {
                this.emit('end');
            }
        })
    }
}

// const res = fs.createReadStream(path.resolve(__dirname, 'test/a.txt                          '), {
const res = new ReadStream(path.resolve(__dirname, 'test/a.txt'), {
    flags: 'r',
    autoClose: true,
    highWaterMark: 3, // 分片读取  不填默认为64k
    start: 0, // 开始读的位置
    end: 3, // 读取结束的位置
})

res.on('open', function(fd) {
    console.log(fd, 'fd');
});

const bufferArr = []
res.on('data', function(data) {
    bufferArr.push(data);
})

res.on('end', function() {
    console.log(Buffer.concat(bufferArr).toString()); 
})

// res.on('close', function(){
//     console.log('close');
// })