const enum STATUS { // 存放所需要的状态
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}
// 核心的逻辑 解析 x 的类型 来决定promise2 走成功还是失败
function resolvePromise(promise2, x, resolve, reject) {
    // 判断x 的值决定promise2 的关系  来判断有可能x 是别人的promise 可能别人的promise会出问题
    if (x == promise2) {
        return reject(new TypeError('出错了'))
    }
    // {}
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        // 只有x是对象或者函数才有可能是promise
        let called = false; // 表示没调用过成功和失败
        try {
            let then = x.then; // 取x上的 then方法
            if (typeof then == 'function') { // {then:function(){}}
                then.call(x, y => { // x.then如果这样写 可能还会走get方法
                    // y 可能是一个promise, 递归解析y的值 直到他是一个普通值为止
                    if (called) return;
                    called = true
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    if (called) return;
                    called = true
                    reject(r);
                });
            }else{
                resolve(x); // 普通对象{}
            }
        } catch (e) {
            if (called) return;
            called = true
            reject(e); // 走失败逻辑
        }
    } else {
        // 如果不是 那一定是一个普通值 
        resolve(x);
    }
}
class Promise{
    static deferred;
    status: STATUS
    value: any
    reason: any
    onResolvedCallbacks: Function[];
    onRejectedCallbacks: Function[];
    constructor(executor: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void) {
        this.status = STATUS.pending;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value?: any) => {
            if (this.status == STATUS.pending) {
                this.status = STATUS.fulfilled;
                this.value = value;
                // 发布模式
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason?: any) => {
            if (this.status == STATUS.pending) {
                this.status = STATUS.rejected;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled?, onRejected?) {
        onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : x => x;
        onRejected = typeof onRejected == 'function' ? onRejected : err => { throw err }
        // 每次调用then 都产生一个全新的promise
        let promise2 = new Promise((resolve, reject) => {
            if (this.status == STATUS.fulfilled) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value); // x可能是一个promise
                        resolvePromise(promise2, x, resolve, reject);
                        // resolve(x); // 用then的返回值 作为下一次then的成功结果
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === STATUS.rejected) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status == STATUS.pending) {
                // 订阅
                this.onResolvedCallbacks.push(() => { // 切片
                    // todo .. 额外的逻辑
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })
            }
        });
        return promise2

    }
    catch(errFn){
        return this.then(null,errFn)
    }
}

// --------------------------------------------
Promise.deferred = function () {
    let dfd = {} as any;
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
export default Promise

