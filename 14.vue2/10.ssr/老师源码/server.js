const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const VueServerRenderer = require('vue-server-renderer')
const static = require('koa-static')

const fs = require('fs');
const path = require('path')
const serverBundle = fs.readFileSync(path.resolve(__dirname, 'dist/server.bundle.js'), 'utf8')
const template = fs.readFileSync(path.resolve(__dirname, 'dist/server.html'), 'utf8');


// serverBundle里存放了Vue实例，将实例和template融合在一起
const render = VueServerRenderer.createBundleRenderer(serverBundle, { 
    template
})

// 通过服务端渲染服务端打包的结果
router.get('/', async (ctx) => {
    ctx.body = await new Promise((resolve, reject) => {
        render.renderToString((err, html) => { // 如果想让css生效 只能使用回调的方式，直接使用下面的await，会导致样式无法渲染。可能是vue-server-renderer中存在bug
            if (err) reject(err);
            resolve(html)
        })
    })
    //    const html = await render.renderToString(); // 生成字符串
    //    console.log(html)
})


app.use(static(path.resolve(__dirname,'dist'))) // 当客户端通过服务器查找文件时，会先去dist目录下查找。如果不使用此插件，index.ssr.html中将找不到client.bundle.js文件
app.use(router.routes());
app.listen(3000);