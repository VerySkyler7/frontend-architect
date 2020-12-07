const STATE = {
    Pending: 'PENDING',
    Fulfilled: 'FULFILLED',
    Rejected: 'REJECTED'
}

function handlePromise (val, resolve, reject) {
    if(val instanceof Promise) {
        val.then((value) => {
            handlePromise(value, resolve, reject);
        }, (reason) => {
            reject(reason)
        })
    }else {
        resolve(val)
    }
}

class Promise {
    constructor(executor) {
        this.value = null;
        this.reasone = null;
        this.state = STATE.Pending;
        this.onFulfilledArr = [];
        this.onRejectedArr = [];
        
        const resolve = (value) => {
            if(this.state === STATE.Pending) {
                if(value instanceof Promise) {
                   value.then(resolve, reject);
                   return;
                }
                this.value = value;
                this.state = STATE.Fulfilled;
                this.onFulfilledArr.forEach(fn => fn());
            }
        }

        const reject = (reason) => {
            if(this.state === STATE.Pending) {
                this.reason = reason;
                this.state = STATE.Rejected;
                this.onRejectedArr.forEach(fn => fn());
            }
        }

        executor(resolve, reject);
    }

    then(onFulfilled, onRejected) {
        if(!onFulfilled || typeof onFulfilled !== 'function') {
            onFulfilled = x => x; // 实现如果onFulfilled为空，则把之前promise的value传递给下一个then
        }
        if(!onRejected || typeof onRejected !== 'function') {
            onRejected = x => x; // 实现如果onFulfilled为空，则把之前promise的value传递给下一个then
        }

        return new Promise((resolve, reject) => { // 实现then返回promise的链式效果
          console.log(888888);
            if(this.state === STATE.Fulfilled) { // 代表executor里的resolve被同步执行
                setTimeout(() => { // 实现then的异步效果
                    const rtnVal = onFulfilled(this.value);
                    handlePromise(rtnVal, resolve, reject); // 处理then里的onFulfilled返回值为promise的情况
                });
            }
            if(this.state === STATE.Rejected) {
                setTimeout(() => {
                    const rtnVal = onRejected(this.reason);
                    handlePromise(rtnVal, resolve, reject);
                })
            }
            if(this.state === STATE.Pending) { // 实现executor中异步调用resolve或reject后，then中的onFulfilled或onRjected被触发
                this.onFulfilledArr.push(() => {
                    setTimeout(() => {
                        const rtnVal = onFulfilled(this.value);
                        handlePromise(rtnVal, resolve, reject);
                    })
                });
                this.onRejectedArr.push(() => {
                    setTimeout(() => {
                        const rtnVal = onRejected(this.reason);
                        handlePromise(rtnVal, resolve, reject);
                    })
                });    
            }
        })
    }
}

const p = new Promise((resolve, reject) => {
    resolve()
});

p.then(val => {
    console.log(val);
}).then(val => val)
.then(val => val);
console.log(9999);