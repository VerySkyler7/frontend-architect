export function test () {
    const p = new Promise((resolve, reject) => {
        resolve(1)
    })
    
    p.then(()=>{}, (err) => {
        console.log(err);
    })
}

test();

// 实现promise的功能
// 1. 正常运行构造函数
// 2. 创建状态，执行resolve reject，改变状态，状态不可逆
// 3. 如果构造函数运行遇到异常，捕获异常，交给reject, 让promise不影响其他流程
// 4. 实现then then的特点如下
// 4.1 resolve或reject的内部执行需要为异步，这样才能将then的回调订阅到promise中，将resolve或reject的值传递给then的回调