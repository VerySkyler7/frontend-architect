const http = require('http') 
const queryString = require('querystring')

const app = http.createServer((req, res) => {
    if(req.url === '/read') {
        // 读取cookie
        res.end(JSON.stringify(queryString.parse(req.headers.cookie, '; ', '=')));
    } else if (req.url === '/write') {
        // 设置cookie
        
        // domain
        // res.setHeader('Set-Cookie', ['name=zf; domain=.ceshi.com', 'age=11; domain=test.ceshi.com']); // 通过ceshi.com访问 只能获取到name 通过test.ceshi.com两个都能获取到
        // res.setHeader('Set-Cookie', ['name=zf', 'age=111']); // 如果没有设置domain，默认只有自己的域名可以访问到自己设置的cookie
        
        // path
        // res.setHeader('Set-Cookie', ['name=zf', 'age=111; path=/write']); // (用的很少) path代表写入和读取的路径，只有该路径才可以返回cookie并且只有该路径才能访问cookie。前提是在当前域名下。

        // expires 有效期 绝对时间
        // const expires = new Date(Date.now() + 1000 * 10).toUTCString();
        // res.setHeader('Set-Cookie', ['name=zf; expires=' + expires, 'age=111']); // 指定一个失效的具体时间需要是格林威治时间(全球统一时间)

        // max-age 有效期 相对时间
        // res.setHeader('Set-Cookie', [ 'name=wp; max-age=5', 'age=18' ]); // 指定一个相对于当前的时间 单位为秒

        // httpOnly
        res.setHeader('Set-Cookie', [ 'name=wp; httpOnly=true', 'age=18' ]); // 可以禁止通过js document.cookie = '' 的方式获取或修改cookie  但是无法控制认为直接修改cookie文件
        res.end('write')

    } else if (req.url === '/test') {
        res.end(JSON.stringify(queryString.parse(req.headers.cookie, '; ', '=')));
    } else {
        res.end('not found');
    }
})

app.listen(3000, () => {
    console.log('start...');
})