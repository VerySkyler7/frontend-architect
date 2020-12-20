const fs = require('fs');
const path = require('path');

/**
 * 异步串行(递归)方式删除文件夹
 * 核心思路：循环每一个儿子，对每一个儿子递归。每一个儿子删除完，执行回调，回调函数和循环代码形成闭包，可持续递归完每个儿子。
 * 关键代码 myRmdir(_filePath, next);中的next会作为删除成功后的回调，形成闭包，一直操作之前的files数组
 */
function myRmdir(_path, cb) {
    const filePath = path.join(__dirname, _path);
    fs.stat(filePath, (err, statObj) => {
        if(err) console.log(err);
        if (statObj.isFile()) {
            fs.unlink(filePath, cb.bind(null, _path));
        } else {
            fs.readdir(filePath, (err, files) => {
                function next() {
                    if(!files.length) return fs.rmdir(filePath, cb.bind(null, _path));
                    const _filePath = path.join(_path, files.shift()||'');
                    myRmdir(_filePath, next);
                }
                next();
            })
        }
    })
}

myRmdir('d copy', (_path) => {
    console.log(_path + '删除成功');
})