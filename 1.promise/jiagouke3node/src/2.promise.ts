const enum STATUS { // 存放所需要的状态
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}
class Promise {
    status: STATUS
    value: any
    reason: any
    onResolvedCallbacks: Function[];
    onRejectedCallbacks: Function[];
    constructor(executor:(resolve:(value?:any)=>void,reject:(reason?:any)=>void)=>void) {
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
            executor(resolve,reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        // 每次调用then 都产生一个全新的promise
        let promise2 = new Promise((resolve, reject) => {
            if (this.status == STATUS.fulfilled) {
                    
                try {
                    let x = onFulfilled(this.value);
                    resolve(x); // 用then的返回值 作为下一次then的成功结果
                } catch (e) {
                    reject(e);
                }
            }
            if (this.status === STATUS.rejected) {
                try {
                    let x = onRejected(this.reason)
                    resolve(x);
                } catch (e) {
                    reject(e);
                }
            }
            if (this.status == STATUS.pending) {
                // 订阅
                this.onResolvedCallbacks.push(() => { // 切片
                    // todo .. 额外的逻辑
                    try {
                        let x = onFulfilled(this.value);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }

                });
                this.onRejectedCallbacks.push(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                })
            }
        });
        return promise2

    }
}
export default Promise

