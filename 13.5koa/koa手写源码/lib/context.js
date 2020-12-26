const ctx = {};

function defineGetter(target, key) {
    ctx.__defineGetter__(key, function() {
        return this[target][key]
    });
}
// 函数颗粒话 将request内置一下


function defineSetter(target,key){
    ctx.__defineSetter__(key,function (value) {
        this[target][key] = value;
    })
}
defineGetter('request','url');
defineGetter('request','path');
defineGetter('response','body');
defineSetter('response','body');

// 上下文就是一个代理对象

// ctx.url == ctx.request.url

// var o = {};
// o.__defineGetter__('gimmeFive', function() { return 5; });
// console.log(o.gimmeFive); // 5

// this. 为啥是两层后的 没听明白  
// ctx.__defineGetter__('url',function () {
//     // ctx.__proto__.__proto__ = ctx
//     return this.request.url
// });
// ctx.__defineGetter__('path',function () {
//     return this.request.path
// })

module.exports = ctx;