const Layer = require("./layer");
const methods = require('methods');
function Route(){
    this.stack = [];
    this.methods = {} // {get:true,post:true,delete:true}
}

methods.forEach(method=>{
    Route.prototype[method] = function (handlers) { // handlers 为用户真实的所有的回调
        handlers.forEach(handler => {
            //                     里层不考虑路径 所以是什么都无所谓
            const layer = new Layer('/',handler);
            layer.method = method;
            this.methods[method] = true;
            this.stack.push(layer);
        });
      
    }
})

Route.prototype.dispatch = function (req,res,out) { // 让用户定义的函数 依次执行
    // 等会请求来了 依次让this.stack 中的方法执行即可
    let requestMethod = req.method.toLowerCase();
    let idx = 0;
    const next = (err) =>{ // 路由中的next走的是这个方法
        if(err) return out(err)
        if(idx>= this.stack.length) return out();
        let layer = this.stack[idx++];
        if(layer.method == requestMethod){
            layer.handle_request(req,res,next);
        }else{
            next();
        }
    }
    next();
}
module.exports = Route