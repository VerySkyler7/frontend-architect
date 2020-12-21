const fs = require("fs").promises;

function* readFile() {
  try {
    const path = require("path");
    const name = yield fs.readFile(
      path.resolve(__dirname, "./name.txt" + 1),
      "utf-8"
    );
    const age = yield fs.readFile(path.resolve(__dirname, name), "utf-8");
    return age;
  } catch (err) {
    console.log(err, 88888);
  }
}

// 初始解决方式
// const it = readFile();
// const {value} = it.next()
// Promise.resolve(value).then(val => {
//   Promise.resolve( it.next(val).value ).then(val => {
//     console.log(val);
//   })
// })

// 演变1
// 测试co需要 npm i co
// const co = require('co')
// res.then(res => console.log(res))

// 实现co的逻辑就是对初始化方式进行递归
function myCo(genFn) {
  return new Promise((resolve, reject) => {
    try {
      const it = genFn();

      function recCo(lastval) {
        const { value, done } = it.next(lastval);
        if (done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(
            (val) => {
              recCo(val);
            },
            (err) => {
              it.throw("generator 报错啦");
            }
          );
        }
      }

      recCo();
    } catch (e) {
      reject(e);
    }
  });
}

const res = myCo(readFile);
res.then((res) => console.log(res)).catch((e) => console.log("出错了"));
