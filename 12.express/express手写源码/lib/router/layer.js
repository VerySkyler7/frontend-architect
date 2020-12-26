const pathToRegExp = require('path-to-regexp')

function Layer(path, handler) {
    this.path = path;
    this.regExp = pathToRegExp(this.path, this.keys = []);
    console.log(this.regExp, this.keys)
    this.handler = handler;
}
Layer.prototype.match = function(pathname) {
    // pathname = /user   /user
    if (this.path == pathname) {
        return true;
    }
    // 中间件只有开头就可以

    let r = pathname.match(this.regExp);
    if(r){
       let  [, ...matches] = r; // 正则匹配的结果 1个是匹配到的整个结果 2第一个分组 3 第二个分组
       this.params = {};
       this.keys.forEach((item, index) => {
           this.params[item.name] = matches[index]
       });
       return true;
    }
    if (!this.route) {
        if (this.path == '/') { // / 可以匹配任何路径
            return true;
        }
        // /user/add   
        return pathname.startsWith(this.path + '/')
    }
    // todo ...
    return false;
}
Layer.prototype.handle_request = function(req, res, next) {
    this.handler(req, res, next)
}
module.exports = Layer;