
//  promise是支持链式调用的 

// 1.无论成功还是失败 都可以返回结果 (1.出错了走错误 2.返回一个普通值（不是promise的值）,就会作为下一次then的成功结果)  3.是promise的情况 （会采用返回的promise的状态）用promise解析后的结果传递给下一个人

// 1.普通值  调用then方法会返回一个全新的promise (不能返回this)
const Promise =require('./bundle')
let promise2 = new Promise((resolve,reject)=>{
    setTimeout(() => {
     reject('ok');
    }, 1000);
}).then(data=>{
    return 1
},err=>{
     return 100
})
promise2.then(data=>{
    console.log(data,'**');
},err=>{
    console.log(err,'----');
})