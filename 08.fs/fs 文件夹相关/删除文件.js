const fs = require('fs');
const path = require('path');

/**
 * 1. 异步串行(递归)方式删除文件夹
 * 核心思路：循环每一个儿子，对每一个儿子递归。每一个儿子删除完，执行回调，回调函数和循环代码形成闭包，可持续递归完每个儿子。
 * 关键代码 myRmdir(_filePath, next);中的next会作为删除成功后的回调，形成闭包，一直操作之前的files数组
 */
function myRmdir(_path, cb) {
    const filePath = path.join(__dirname, _path);
    fs.stat(filePath, (err, statObj) => {
        if (err) console.log(err);
        if (statObj.isFile()) {
            fs.unlink(filePath, cb.bind(null, _path));
        } else {
            fs.readdir(filePath, (err, files) => {
                function next() {
                    if (!files.length) return fs.rmdir(filePath, cb.bind(null, _path));
                    const _filePath = path.join(_path, files.pop() || '');
                    myRmdir(_filePath, next);
                }
                next();
            })
        }
    })
}

// myRmdir('d copy', (_path) => {
//     console.log(_path + '删除成功');
// })

/**
 * 广度遍历形成flat数组
 * 串行从数组中由后往前依次删除
 */
function myRmdir1(_path, cb) {
    fs.stat(path.join(__dirname, _path), (err, statObj) => {
        if (statObj.isFile()) {
            fs.unlink(_path, cb);
        } else {
            // 读取第一层儿子
            // 存放数组
            // 递归读取
            // 没有儿子则返回
            const stacks = [_path];
            let index = 0;
            function next() {
                const dir = stacks[index++];
                if (!dir) return reverseRmove(stacks);
                const filePath = path.join(__dirname, dir);
                fs.readdir(filePath, (err, files) => {
                    if (!files) return next();
                    files = files.map(file => path.join(dir, file))
                    stacks.push(...files);
                    next();
                })
            }
            next();

            function reverseRmove(stacks) {
                let index = stacks.length - 1;
                function next() {
                    let file = path.join(__dirname, stacks[index--]);
                    fs.stat(file, (err, statObj) => {
                        if (statObj.isFile()) {
                            fs.unlink(file, next);
                        } else {
                            fs.rmdir(file, next)
                        }
                    });
                }
                next();
            }
        }
    })

}

// myRmdir1('d copy', () => {
//     console.log('删除成功');
// });

/**
 * 异步并行删除
 * 核心通过for循环删除
 */
function myRmdir2(filePath, cb) {
    // 1. 先取到第一个
    //  1. 如果是文件，直接删除
    //  2. 如果是没有娃的文件夹，直接删除
    // 2. 遍历出第一层所有的娃，开始for循环删除，当每一层的文件或空文件夹删除完毕后，通知它的父级文件夹删除自己
    const _path = path.join(__dirname, filePath);
    fs.stat(_path, (err, statObj) => {
        if (statObj.isFile()) {
            fs.unlink(_path, cb);
        } else {
            fs.readdir(_path, (err, files) => {
                if (!files.length) {
                    fs.rmdir(_path, cb);
                } else {
                    let count = 0;
                    files.forEach(file => {
                        myRmdir2(path.join(filePath, file), countRmoved);
                    })
                    function countRmoved() {
                        if(++count === files.length) {
                            fs.rmdir(_path, cb);
                        }
                    }
                }
            })
        }
    })
}

// myRmdir2('d copy', () => {
//     console.log('删除成功');
// });

/**
 * 使用promise并发删除
 * 核心代码利用Promise.all 加递归的方式处理
 * 递归是第二层会有自己的Promise.all，Promise.all结束后，会触发第二层的resolve，这样第一层的Promise.all会被触发
 * 所有的子文件被删除后，会触发Prmoise.all，在then里面把父文件夹删除(当files为空数组时，会直接删掉空文件夹)
 */
function myRmdir3(_path) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, _path);
        fs.stat(filePath, (err, statObj) => {
            if (err) reject(err);
            if (statObj.isFile()) {
                fs.unlink(filePath, resolve);
            } else {
                fs.readdir(filePath, (err, files) => {
                    if (err) reject(err);
                    files = files.map(file => myRmdir3(path.join(_path, file)));
                    Promise.all(files) 
                    .then(() => {
                        fs.rmdir(filePath, resolve);
                    })
                    .catch(err => reject(err));
                })
            }
        })
    })
}

// myRmdir3('d copy')
// .then(() => console.log('删除成功'))
// .catch(() => console.log('删除失败'));

/**
 * 使用async await
 */
const fs1 = require('fs').promises;
async function myRmdir4(_path) {
    const filePath = path.join(__dirname, _path);
    const statObj = await fs1.stat(filePath);
    if(statObj.isDirectory()) {
        let files = await fs1.readdir(filePath);
        files = files.map(file => myRmdir4(path.join(_path, file)));
        await Promise.all(files);
        await fs1.rmdir(filePath);
    } else {
        await fs1.unlink(filePath);  // await不可以去掉，否则fs1.unlink的fulfilled会在代码运行完后才触发
    }
}

// myRmdir4('d copy')
// .then(() => console.log('删除成功'))
// .catch(() => console.log('删除失败'));