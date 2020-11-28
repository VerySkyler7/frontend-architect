// 1.每个promise 都有三个状态 pennding等待态  resolve 标识变成成功态 fulfilled reject 标识变成失败态 REJECTED
// 2.每个promise 需要有一个then方法 ， 传入两个参数 一个是成功的回调另一个是失败的回调
// 3.new Promise会立即执行
// 4.一旦成功就不能失败 一旦失败不能成功
// 5.当promise抛出异常后 也会走失败态
const enum STATUS { // 存放所需要的状态
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}
class Promise {
    status: STATUS
    value: any
    reason: any
    onResolvedCallbacks:Function[];
    onRejectedCallbacks:Function[];
    constructor(executor) {
        this.status = STATUS.pending; // 当前默认状态
        this.value = undefined; // 成功原有 
        this.reason = undefined; // 失败原因
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value?:any) => {
            if(this.status == STATUS.pending){
                this.status = STATUS.fulfilled;
                this.value = value;
                // 发布模式
                this.onResolvedCallbacks.forEach(fn=>fn());
            }
        }
        const reject = (reason?:any) => {
            if(this.status == STATUS.pending){
                this.status = STATUS.rejected;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn=>fn());
            }
        }
        try{
            executor(resolve,reject);
        }catch(e){
            reject(e);
        }
    }
    then(onFulfilled,onRejected){
        if(this.status == STATUS.fulfilled){
            onFulfilled(this.value);
        }
        if(this.status === STATUS.rejected){
            onRejected(this.reason)
        }
        if(this.status == STATUS.pending){
            // 订阅
            this.onResolvedCallbacks.push(()=>{ // 切片
                // todo .. 额外的逻辑
                onFulfilled(this.value)
            });
            this.onRejectedCallbacks.push(()=>{
                onRejected(this.reason);
            })
        }
    }
}
export default Promise

