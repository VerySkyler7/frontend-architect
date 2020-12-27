// require的实现思路
// 1. 用户调用require方法后，创建一个Module实例
// 2. 使用fs读取文件，通过一个字符串函数将读取到的文件内容包裹起来
// 3. 将字符串函数通过vm返回一个函数
// 4. 执行vm返回的函数，通过call将函数内部的this指向module的exports
// 5. 此时用户赋值给module.exports的代码会被执行
// 6. 最终通过require将module.exports返回
// 重点：使用require时，module.exports和exports指向的是同一个引用地址，最终使用的是module.exports,因此给exports重新赋值一个引用值时，不会对module.exports产生影响

const path = require('path');
const fs = require('fs');

function Module (id) {
  this.id = id;
  this.exports = {}; // 4.1 创建一个exports对象，用于承载id对应的内容
}

Module._extensions = {
  '.js'(module){
    console.log(module);
  },
  '.json'(){}
}

// 3. 看下路径是否真实存在，如果不存在尝试给文件添加后缀
Module.resolveFilePath = function (id) {
  let filePath = path.resolve(__dirname, id); // 以require的所在文件为基准？？，根据__dirname及相对路径通过resolve找到文件的绝对路径
  if(fs.existsSync(filePath)) return filePath;
  const extensions = Object.keys(Module._extensions);
  for(let i = 0; i < extensions; i++) {
    let newFilePath = filePath + extensions[i];
    if(fs.existsSync(newFilePath)) return newFilePath;
  }
  throw new Error('文件路径不存在');
}

Module.prototype.load = function () {
  // 6. 根据不同的后缀，执行不同的策略模式
  const extName = path.extname(this.id);
  Module._extensions[extName](this);
}

Module._load = function (id) {
  let filePath = Module.resolveFilePath(id); // 2. 根据引用的路径，找到文件的绝对路径
  const module = new Module(filePath); // 4. 将path传递给Module，创建新的Module实例
  module.load(); // 5. 读取文件，用户给exports赋值。用户给module.exports赋值，如何把文件里的module和require创建的module实例建立关联
  return module.exports;
}

// 1. 根据路径加载模块
function req(id) { 
  Module._load(id);
}

const r = req('./a/demo.js')
