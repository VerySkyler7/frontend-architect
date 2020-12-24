const express = require('express')

const server = express()

// 路由的用法
// server.get('/', (req, res, next) => { // 1 这些cb函数为路由中间件，在res.end之前可以分步做很多其他的事
//     console.log(1111);
//     next(); // 2 如果没执行next，不向下运行。next运行的则是下一个cb。
//     console.log(3333);
// }, (req, res, next) => {
//     console.log(22222);
//     next();
//     console.log(44444); // 3 当所有的next都执行完才会执行next之后的代码，next之后的代码是从后往前依次执行，遵循调用栈先进后出的原则(这种模型叫做洋葱模型)
// });

// server.get('/', (req, res) => {
//     res.end('home1') // 4 每个path必须要有对应的end，否则客户端不会收到响应
//     console.log(55555);
// });

// use的用法
// server.use(function(req, res, next) { // use为函数中间件，中间件可以有多个cb
//     console.log('middle 1');
//     next();
// }, function(req, res, next) {
//     next();
// })

// server.use(function(req, res, next) {
//     console.log('middle 2');
//     next()
// })

// server.use('/hello', function(req, res, next) {
//     res.end('world');
//     next()
// }, function(req, res, next) {
//     console.log(8888);
//     next();
// })

// 处理中间件错误
// server.use((req, res, next) => {
//     next('err') // next有参数，会寻找有四个参数的中间件进行调用
// })

// server.use((req, res, next) => {
//     console.log(333);
// })

// server.use((err, req, res, next) => {
//     console.log(err);
// })

// 二级路由及参数
// 客户端路径 curl -v http://localhost:3002/user/add/1/2
// let router = express.Router()
// router.get('/add/:id/:name', (req, res, next) => {
//     console.log(req.params);
//     res.end('添加')
// })

// router.post('/remove',function(req,res,next){
//     res.end('删除')
// })

// server.use('/user', router);


server.listen(3002, () => {
    console.log('start....');
});
