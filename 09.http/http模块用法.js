const http = require('http');
const url = require('url');

// request url http://localhost:3000/baidu.com?a=123#155
// curl -v http://localhost:3000/test?a=569 get方式 
// curl -v -d "tes" -X POST http://localhost:3000/test?a=569 POST方式请求 -d为请求体的内容， get方式也可以加请求体
const server = http.createServer((req, res) => {
    // -------------------请求行----------------------
    console.log(req.method); // method是大写，其余基本都是小写
    console.log('req.url', req.url);
    let { pathname, query } = url.parse(req.url, true); // true的作用是解析 queryString
    console.log('pathname', pathname); // /baidu.com?a=123
    console.log('url param', query.a); // 123
    console.log(req.httpVersion); // http是基于tcp的  在tcp的基础上添加了 内容而已，内容被分割后，放到对应的req和响应上


    // -------------------请求头----------------------
    console.log('请求头', req.headers); // key 和 value都是小写

    // -------------------请求体----------------------
    // req是一个可读流
    let arr = [];
    req.on('data', (chunk) => {
        arr.push(chunk);
    });
    req.on('end', () => {
        console.log('req content', Buffer.concat(arr).toString());
    })


    // -------------------响应行----------------------
    res.statusCode = 200;
    res.statusMessage = 'o-k';

    // -------------------响应头----------------------
    res.setHeader('Auth', 'xxx');
    res.setHeader('Content-Type', 'text/html;charset=utf-8'); // 需要设置类型和编码，浏览器默认是gbk，没有utf-8会是乱码，必须要有-，否则ie会有问题

    // -------------------响应体----------------------
    // res是一个可写流
    res.write('哈喽');
    res.end('end');

});

// 其他
server.on('request', (req, res) => {
    console.log('req2', 'createServer内部是订阅发布模式');

    // node是单线程模式，适合做密集型I/O，不适合做密集计算
    // 以下示例发起第二个请求时会出现等待
    // const {pathname} =url.parse(req.url)
    // if (pathname == '/sum') { // node适合I/O fs模块里面的
    //     let sum = 0;  // 子进程 进行ipc通信 来实现
    //     for (let i = 0; i < 10000000000; i++) {
    //         sum += i;
    //     }
    //     res.end(sum + '');
    // } else {
    //     res.end('ok')
    // }
})

let port = 3000;
server.listen(port, (err) => {
    console.log('server has started');
    // if(err && err.errno === 'EADDRINUSE') server.listen(++port);
})

// 解决多端口启动问题
server.on('error', (err) => {
    if (err.errno === 'EADDRINUSE') server.listen(++port);
})