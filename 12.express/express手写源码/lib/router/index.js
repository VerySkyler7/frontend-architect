const url = require('url');
const Layer = require('./layer');
const Route = require('./route');
const methods = require('methods');

function Router() { // 能充当构造函数 也可以充当类 , 无论是new 还是call 都返回一个函数
    let router = function(req,res,next){
        // 请求到来时 匹配到路径后会执行此方法，我需要去stack中依次执行
        router.handle(req,res,next); // 执行对应stack中的路由系统
    }
    router.stack = [];
    router.__proto__ = proto; // 代码基本没有改变 但是让类支持了函数的调用
    return router; // 如果类返回一个引用类型  当前这个返回值会作为类的实例
}


// 外层的layer 考虑路径   里层的layer考虑方法 = 同一个类
let proto = {};
proto.route = function(path) {
    let route = new Route();
    let layer = new Layer(path, route.dispatch.bind(route)); // 每次调用get方法， 都会产生一个layer实例和一个route实例

    // 这个关联目的是可以在layer获取route的信息
    layer.route = route; // 路由中的layer 都有一个route属性 和 我们的route关联起来
    this.stack.push(layer)
    return route;
}
proto.use = function(path, ...handlers) {
    if (!handlers[0]) { // 只传递了一个函数 
        handlers.push(path); // app.use(function(){})  app.use()
        path = '/'
    }
    handlers.forEach(handler => {
        let layer = new Layer(path, handler);
        layer.route = undefined; // 不写也是undefined ， 主要告诉你 中间件没有route
        this.stack.push(layer);
    })
}
// app.get
methods.forEach(method => {
    // app.get => handlers   rouer.get
    proto[method] = function(path, handlers) { // handlers 是用户定义get时传递过来的所有执行函数  （数组）
        if(!Array.isArray(handlers)){
            handlers = Array.from(arguments).slice(1);
        }
        let route = this.route(path); // 创建一个route实例
        // 创建一个layer  还要创建一个route，将handlers 传递给route
        route[method](handlers);

    }
})

proto.handle = function(req, res, done) {
    let { pathname } = url.parse(req.url);
    let method = req.method.toLowerCase()
    let idx = 0;
    let removed = '';
    const next = (err) => { // 中间件 和内部的next方法 出错都会走这个next
        if (idx >= this.stack.length) return done(); // 路由处理不了 传递给应用层
        let layer = this.stack[idx++];
        if(removed.length){
            req.url = removed + req.url;
           removed = '';
        }
        if (err) {
            // 如果有错误 ， 找错误处理中间件
            if(!layer.route){ // 中间件
                if(layer.handler.length === 4){
                    layer.handler(err,req,res,next)
                }else{
                    next(err);
                }
            }else{ // 路由
                next(err);
            }
        } else {
            // 无论是路由还是中间件 前提是路径必须匹配
            if (layer.match(pathname)) { // match还没有更改
            
                req.params =  layer.params
                if (!layer.route) { // 没有说明是中间件
                    // 正常中间件不走错误
                    if(layer.handler.length !== 4){
                        // 进入到中间件的时候 需要将中间件的路径移除掉
                        //add
                        if(layer.path !== '/'){
                            removed = layer.path; // 要删除的部分  中间件要是/ 就不要删除了
                            req.url = req.url.slice(layer.path.length) ;
                        }


                        layer.handle_request(req, res, next); // 直接执行中间件函数
                    }else{
                        next();
                    }
                } else {
                    // 路由必须匹配方法
                    if (layer.route.methods[method]) { // 这个next可以让路由层扫描下一个layer
                        layer.handle_request(req, res, next); // route.dispatch
                    } else {
                        next();
                    }
                }
            } else {
                next();
            }
        }
    }
    next(); // 请求来了取出第一个执行

}
module.exports = Router;

