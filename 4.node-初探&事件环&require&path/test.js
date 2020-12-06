// const path = require('path')
// console.log(require('./a/demo')('../../b'));

setTimeout(()=>{
    console.log(4);
    process.nextTick(()=> console.log(5))
});

new Promise(res => res(3)).then(val => console.log(val));

process.nextTick(()=>{
    console.log(2);
});

console.log(1);