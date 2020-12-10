const fs = require('fs')
const path = require('path')

/**
 * fs read write 分片读写文件原理
 * 1. 定义一个waterBuffer存放切片
 * 2. 将fs.read读取的切片存放到waterBuffer
 * 3. 将waterBuffer的字节通过fs.write写入目标文件
 * 4. (核心)定义一个变量用于记录已经写入了多少字节，每次递归读取写入文件，递增该变量，将该变量作为每次读取和写入的初始位置
 */

fs.open(path.resolve(__dirname, 'a.txt'), 'r', (error, rfd) => {
    fs.open(path.resolve(__dirname, 'b.txt'), 'w', (err, wfd) => {
        let highWaterMark = 3;
        let offsetRead = 0;
        let offsetWritten = 0;
        let s = null;
        const waterBuffer = Buffer.alloc(10);
        function next (offsetRead, offsetWritten) {
            fs.read(rfd, waterBuffer, 0, highWaterMark, offsetRead, (err, bytesRead) => {
                if(bytesRead !== 0 && !err) {
                    fs.write(wfd, waterBuffer, 0, highWaterMark, offsetWritten, (err, written) => {
                        offsetRead += bytesRead;
                        offsetWritten += written;
                        s = setInterval(() => {  // 需要切换文件查看动态效果
                            clearInterval(s)
                            next(offsetRead, offsetWritten)
                        }, 1000)
                    })
                } else {
                    clearInterval(s)
                    fs.close(rfd, () => {})
                    fs.close(wfd, () => {})
                }
            })
        }
        next(offsetRead, offsetWritten);
    })
})
