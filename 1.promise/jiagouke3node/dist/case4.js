// const Promise =require('./bundle')
// let promise2 = new Promise((resolve,reject)=>{
//     resolve('ok')
// }).then(data=>{
//    return promise2 // 我等待我自己去干些事， 我没有任何动作
// },err=>{
   
// });
// promise2.then(data=>{
//     console.log(data);
// },err=>{
//     console.log(err,'999')
// })


// ---------------------------------


const Promise =require('./bundle');
let resultObj = {}
let index = 0;
Object.defineProperty(resultObj,'then',{
    get(){
        if(++index == 2){
            throw new Error('出错了')
        }
    }
})
let promise2 = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
   return resultObj // 我等待我自己去干些事， 我没有任何动作
},err=>{
   
});
promise2.then(data=>{
    console.log(data);
},err=>{
    console.log(err,'999')
})
