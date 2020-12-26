const url = require('url')
const request = {
    get path(){ // Object.defineProperty()
        return url.parse(this.req.url).pathname
    },
    get url(){
        return this.req.url
    }
};

// request文件仅仅是为了对req进行扩展


module.exports = request;

