const Promise = require('./bundle')
// let p = new Promise((resolve, reject) => {
//     reject('ok');
// });

// // 穿透
// p.then(data=>data).then().then((data) => {
//     console.log(data);
// },err=>{
//     console.log('e',err);
// })

// 链式调用 
let fs = require('fs');
// Promise.deferred = function () {
//     let dfd = {} as any;
//     dfd.promise = new Promise((resolve,reject)=>{
//         dfd.resolve = resolve;
//         dfd.reject = reject;
//     })
//     return dfd;
// }
function read(url) {
    let dfd = Promise.deferred(); // 延迟对象
    fs.readFile(url, 'utf8', function(err, data) {
        if (err) dfd.reject(err)
        dfd.resolve(data);
    })
    return dfd.promise
}
read('./name.txt').then((data => {
    return read(data + '1');
})).then(data => {
    console.log(data);
}).catch(err=>{
    console.log(err);
}).then(data=>{
    console.log(data);
});


//   ----------------all方法----------------



