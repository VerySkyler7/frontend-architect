const express = require('express')

const server = express()

server.get('/', (req, res, next) => { // 1 这些cb函数为路由中间件，在res.end之前可以分步做很多其他的事
    console.log(1111);
    next(); // 2 如果没执行next，不向下运行。next运行的则是下一个cb。
    console.log(3333);
}, (req, res, next) => {
    console.log(22222);
    next();
    console.log(44444); // 3 当所有的next都执行完才会执行next之后的代码，next之后的代码是从后往前依次执行，遵循调用栈先进后出的原则(这种模型叫做洋葱模型)
});

server.get('/', (req, res) => {
    res.end('home1') // 4 每个path必须要有对应的end，否则客户端不会收到响应
    console.log(55555);
});

server.listen(3000, () => {
    console.log('start....');
});
