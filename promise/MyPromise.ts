import { MyPromise } from "./手写Promise 遵循Promise A+";

interface IResolve {
  (value?: any): void;
}

interface IReject {
  (reason?: any): void;
}

interface IExecutor {
  (resolve: IResolve, reject: IReject): void;
}

enum STATE {
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
  PENDING = "pending",
}

export class Promise {
  value: any = undefined;
  reason: any = undefined;
  state: STATE = STATE.PENDING;
  onFulfilled: Function = () => { };
  onRejected: Function = () => { };

  constructor(executor: IExecutor) {
    const resolve: IResolve = (value: any) => {
      setTimeout(() => {
        if (this.state === STATE.PENDING) {
          this.state = STATE.FULFILLED;
          this.value = value;
          this.onFulfilled();
          // this.fulfilledFns.forEach((fn) => fn(this.value));
        }
      })
    };
    const reject: IReject = (reason: any) => {
      setTimeout(() => {
        if (this.state === STATE.PENDING) {
          this.state = STATE.REJECTED;
          this.reason = reason;
          this.onRejected();
          // this.rejectedFns.forEach((fn) => fn(this.reason));
        }
      })
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled?: (res: any) => any, onRejected?: (res: any) => any): Promise { // then只是注册回调，等到resolve或reject的执行
    // onFulfilled && (this.onFulfilled = onFulfilled);
    // onRejected && (this.onRejected = onRejected);
    // return new MyPromise((resolve, reject) => {
    //   resolve(this.onFulfilled())
    // })
    return new Promise((resolve, reject) => {
      if (onFulfilled) {
        this.onFulfilled = function () {
          try {
            const newValue = onFulfilled(this.value);
            resolve(newValue);
          } catch (error) {
            reject(error);
          }
        }
      }
      if (onRejected) {
        this.onRejected = function () {
          try {
            const newValue = onRejected(this.reason);
            resolve(newValue);
          } catch (error) {
            reject(error)
          }
        }
      }
    })

  }
}

const p = new Promise((resolve, reject) => {
  console.log(1);
  reject(4)
  console.log(2);
});

p.then(
  (res) => {
    console.log(res);
  },
  (res) => {
    console.log(res);
    throw new Error('5')
  }
).then((res) => {
  console.log(res);
}, (res) => {
  console.log(res);
  console.log(6);
  
});

console.log(3);
