// 1.promise 可以解决多个异步并行执行，最终得到所有的结果
// 2.异步嵌套问题

// 1.每个promise 都有三个状态 pennding等待态  resolve 标识变成成功态 fulfilled reject 标识变成失败态 REJECTED
// 2.每个promise 需要有一个then方法 ， 传入两个参数 一个是成功的回调另一个是失败的回调
// 3.new Promise会立即执行
// 4.一旦成功就不能失败 一旦失败不能成功
// 5.当promise抛出异常后 也会走失败态
const Promise = require('./bundle');
let promise = new Promise((resolve,reject)=>{
        resolve('111');
    // throw new Error('失败')
});
promise.then((data)=>{
    console.log('success',data);
},(err)=>{
    console.log('faild',err)
})
promise.then((data)=>{
    console.log('success',data);
},(err)=>{
    console.log('faild',err)
})