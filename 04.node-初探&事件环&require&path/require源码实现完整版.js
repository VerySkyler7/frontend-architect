const path = require('path');
const fs = require('fs');
const vm = require('vm'); // 虚拟机模块 创建沙箱用的
function Module(id) {
    this.id = id;
    this.exports = {};
}
// 内部可能有n种解析规则
Module._extensions = {
    '.js'(module) {
        let script = fs.readFileSync(module.id, 'utf8'); // 读取文件的内容
        let code = `(function (exports, require, module, __filename, __dirname) {
            ${script}
        })`;
        let func = vm.runInThisContext(code);
        let exports = module.exports;
        let thisValue = exports
        let dirname = path.dirname(module.id);
        func.call(thisValue,exports,req,module,module.id,dirname);
    },
    '.json'(module) {
        let script = fs.readFileSync(module.id, 'utf8');
        module.exports = JSON.parse(script)
    } // 根据不同的后缀 定义解析规则
}
Module._resolveFilename = function(id) {
    let filePath = path.resolve(__dirname, id);
    // 我应该看下这个文件路径是否存在，如果不存在尝试添加后缀
    let isExsits = fs.existsSync(filePath);
    if (isExsits) return filePath; // 文件存在直接返回
    let keys = Object.keys(Module._extensions); // [.js,.json]

    for (let i = 0; i < keys.length; i++) {
        let newFilePath = filePath + keys[i];
        if (fs.existsSync(newFilePath)) return newFilePath
    }
    throw new Error('模块文件不存在')
}
Module.prototype.load = function() {
    // 核心的加载，根据文件不同的后缀名进行加载
    let extname = path.extname(this.id);
    Module._extensions[extname](this);
}
Module._cache = {};
Module._load = function(id) {
    let filename = Module._resolveFilename(id); // 就是将用户的路径变成绝对路径

    if(Module._cache[filename]){
        return Module._cache[filename].exports; // 如果有缓存直接将上次缓存的结果返回即可
    }

    let module = new Module(filename);
    Module._cache[filename] = module; 
    module.load(); // 内部会读取文件 用户会给exports对象赋值 
    return module.exports;
}
function req(id) { // 根据用户名加载模块
    return Module._load(id);
}
const r = require('./b.js');

// 基本数据类型和 引用类型的区别
setTimeout(() => {
    let  r = require('./b.js');
    console.log(r);
}, 2000);
console.log(r);
// 问题1.module.exports 和 exports关系是什么？ （exports = 新值 这样不会改变module.exports 的空间）
// 问题2.b模块中的gloabl 和 useB中的global是不是同一个 (所有相关模块中的global都是同一个，尽量不要使用global，可能会污染全局变量 连接属性conn)
// 问题3. 同时写module.exports 和 exports
// es6 可以既使用export default 又可以使用exports

// node --inspect-brk 文件名
// chrome://inspect/
// vscode 直接进行调试  


// require是一个Module原型上的方法 Module.prototype.require
// Module._load 加载方法 (模块加载)
// Module._resolveFilename (解析文件名 变成绝对路径 并且带有后缀)
// new Module 创建一个模块(id,exports)  require方法获取到的是module.exports 属性
// Module.prototype.load 进行模块的加载
// js 模块 json模块 ，根据不同的后缀名 使用不同的策略去进行模块的加载
// fs.readFile读取文件的内容
//  module._compile 进行内容包裹一个函数
// const wrapper = [
// '(function (exports, require, module, __filename, __dirname) { ',
//     script
//];
// 让文件执行，用户会给exports 赋值
// 最终获取到的就是module.exports后的结果


// http://www.zhufengpeixun.com/grow/html/94.3.MODULE.html#t154.%20CMD