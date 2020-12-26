const EventEmitter = require('events');
const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
// 1.每个应用的上下文应该是独立的
class Application extends EventEmitter {
    constructor() {
        super();
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response); // 应用间的属性隔离
        this.middlewares = [];
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
    createContext(req, res) {
        let ctx = Object.create(this.context); // 每次请求都用同一个上下文， 每次请求的隔离 
        let request = Object.create(this.request);
        let response = Object.create(this.response);
        ctx.request = request; // req的属性都是原生的
        // ctx.request.req 可以在自己封装的request中拿到原生的req属性
        ctx.req = ctx.request.req = req;
        ctx.response = response;
        ctx.res = ctx.response.res = res;

        return ctx;
    }
    compose(ctx) { // koa 核心代码
        let index = -1;// 默认没有调用过
        const dispatch = (i) => {
            if( i<= index){
                return Promise.reject('next() call multiples times')
            }
            index = i; // index = 1;  
         
            if (i === this.middlewares.length) return Promise.resolve();
            let middleware = this.middlewares[i]; // 数组的第一个
            return Promise.resolve(middleware(ctx, () => dispatch(i + 1))); // 当用户调用next时会取出下一个继续执行
        }
        return dispatch(0);
    }
    handleRequest(req, res) {
        let ctx = this.createContext(req, res); // 根据原生的请求和响应创建上下文
        res.statusCode = 404;

        this.compose(ctx).then(() => {
            // ---------复杂逻辑-----------------
            if (ctx.body) {
                res.end(ctx.body);
            } else {
                res.end('Not Found')
            }
        }).catch(err=>{
            this.emit('error',err)
        })
        // this.middleware(ctx); // 这个函数会给body赋值
    }
    listen() {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(...arguments)
    }
}

module.exports = Application


// let index = -1
// function a(i){
//     if(i <= index) return xxx
//     index = i; // index = 1
// }
// a(1);
// a(1);


// function a(index){ // index = 0;
//     return b(()=>a(index));
// }
// a(0);

// function b(fn){
//     console.log(fn)
// }


// koa ctx 和中间件原理  express 和 koa 后面会继续使用（用的话非常简单） 
// mongo redis 