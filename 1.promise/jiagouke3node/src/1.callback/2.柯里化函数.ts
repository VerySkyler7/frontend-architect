// 柯里化函数 

// 判断一个变量的类型 
// 1.typeof 2.constructor 3.intanceof 4.Object.prototype.toString.call

// function isType(val:unknown,typing:string){
//     return Object.prototype.toString.call(val) == `[object ${typing}]`
// }
// let r = isType('hello','String');

// isString isNumber isBoolean ....


// 柯里化的功能 就是让函数的功能更具体些  (保留参数)
// 反柯里化 就是让函数的范围变大 

// type ReturnFn = (val:unknown) => boolean
// let utils:Record<'isString' | 'isNumber' | 'isBoolean',ReturnFn> = {}  as any;
// function isType(typing:string){ // 高阶函数可以用于保存参数
//    return function (val:unknown) {
//          return Object.prototype.toString.call(val) == `[object ${typing}]`
//    }
// }
// ['String','Number','Boolean'].forEach(type=>{
//     utils['is'+type] = isType(type); // 闭包
// })
// console.log(utils.isString('123'));
// console.log(utils.isNumber(123));



// 实现一个通用的柯里化函数 ， 可以自动的将一个函数转换成多次传递参数 lodash

const curring = (fn: Function) => { // sum
    const exec = (sumArgs: any[] = []) => {
        // 如果当前传入参数的个数 小于函数的参数个数  需要返回一个新的函数 , 并且保留当前函数传入的参数
        return sumArgs.length >= fn.length ? fn(...sumArgs) : (...args: any[]) => exec([...sumArgs, ...args])
    }
    return exec(); // 用于收集每次执行时传入的参数 ，第一次默认就是空的
}

// function sum(a, b, c, d) { // 参数固定的情况做柯里化 ， 函数的长度就是参数个数
//     return a + b + c + d
// }


function isType( typing: string,val: unknown) {
    return Object.prototype.toString.call(val) == `[object ${typing}]`
}
let isString = curring(isType)('String');
let isNumber = curring(isType)('Number');

console.log(isString('helllo'))

// 暂存变量


export {}