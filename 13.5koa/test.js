const Koa = require('koa')

const koa = new Koa();

const sleep = () => {
    return new Promise(res => {
        setTimeout(() => {
            res();
        }, 1000)
    })
}

koa.use(async (ctx, next) => {
    let res = await next();
    console.log(res);
    console.log(2222);
    ctx.body = 2;
})

koa.use(async (ctx, next) => {
    await sleep();
    console.log(1111);
    return 'res'
})

koa.listen(3000);