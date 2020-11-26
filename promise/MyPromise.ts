interface IResolve {
  (value?: any): void;
}

interface IReject {
  (reason?: any): void;
}

interface IExecutor {
  (resolve: IResolve, reject: IReject): void;
}

interface IFThenCB {
  (result: any): any;
}

enum STATE {
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
  PENDING = "pending",
}

export function handlePromise(promise2: Promise, x: Promise, resolve: IResolve, reject: IReject) {
  try {
    if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
      x.then((y: any) => {
        handlePromise(promise2, y, resolve, reject);
      }, (r: any) => {
        reject(r);
      })
    } else {
      resolve(x);
    }
  } catch (error) {
    reject(error);
  }
}

export class Promise {
  value: any = undefined;
  reason: any = undefined;
  state: STATE = STATE.PENDING;
  onFulfilledArr: Function[] = [];
  onRejectedArr: Function[] = [];

  constructor(executor: IExecutor) {
    const resolve: IResolve = (value: any) => {
      if (this.state === STATE.PENDING) {
        this.state = STATE.FULFILLED;
        this.value = value;
        this.onFulfilledArr.forEach((fn) => fn());
      }
    };
    const reject: IReject = (reason: any) => {
      if (this.state === STATE.PENDING) {
        this.state = STATE.REJECTED;
        this.reason = reason;
        this.onRejectedArr.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled?: IFThenCB, onRejected?: IFThenCB): Promise { // p1
    const promise2 = new Promise((resolve, reject) => { // p2是p1的then的返回值
      if (this.state === STATE.FULFILLED) {
        // 这样做可以确保同一个promise，不同的then在不同时机执行时，确保拿到同一个值
        try {
          setTimeout(() => {
            if (onFulfilled) {
              const x = onFulfilled(this.value); // p3是p1 then的回调的返回值
              // 通过p1里onFulfilled返回的p3的状态，来决定p2的状态
              handlePromise(promise2, x, resolve, reject);
            }
          });
        } catch (err) {
          reject(err);
        }
      }

      if (this.state === STATE.REJECTED) {
        try {
          setTimeout(() => {
            onRejected && onRejected(this.reason);
          });
        } catch (err) {
          reject(err);
        }
      }

      if (this.state === STATE.PENDING) {
        onFulfilled &&
          this.onFulfilledArr.push(() => {
            // 此方式为aop 切片，将切片函数进行订阅，aop方便做一些额外的事
            setTimeout(() => {
              try {
                const newValue = onFulfilled(this.value);
                resolve(newValue);
              } catch (error) {
                reject(error);
              }
            });
          });
        onRejected &&
          this.onRejectedArr.push(() => {
            setTimeout(() => {
              try {
                const newValue = onRejected(this.reason);
                resolve(newValue);
              } catch (error) {
                reject(error);
              }
            });
          });
      }
    });

    return promise2;
  }
}

const p = new Promise((res, rej) => {
  res(1)
}).then(() => {
  return new Promise((res, rej) => {
    res(2)
  }).then(
    () => {
      return new Promise((res, rej) => {
        res(3)
      })
    },
    () => {
      console.log(3.5)
      return new Promise((res, rej) => {
        rej(4)
      })
    }
  )
})

p.then(res => {
  console.log(res)
}, res => {
  console.log(res)
})

// const p1 = new Promise((resolve, reject) => {
//   resolve(1);
// })

// const p2 = p1.then(val => {
//   const p3 = new Promise((resolve, reject) => {
//     resolve(val);
//   })
//   return p3;
// }, val => {

// });

// p2.then(
//   (res) => {
//     console.log(res);
//     console.log(2);
//   },
//   (res) => {
//     console.log(res);
//     console.log(3);
//   }
// );

// Promise constructor 规范
// 1. 构造函数里的代码为同步代码
// 2. promise的初始状态为pending，当触发回调resolve，状态变为fulfilled，当触发回调reject或抛出异常时，状态变为rejected
// 3. 当状态发生变化后，状态不可逆
// 4. 构造器里的回调executor遇到异常时，会被构造器捕获，不会中断程序的运行。
// 5. 构造器里的executor回调中的resolve或reject的内部执行为异步
// 6. resolve、reject接受的参数可以是包含promise的任意值

// promise then 规范
// 0. then方法返回的是一个新的promise
// 1. 无论在onFulfilled还是onRejected的回调中，返回的是非promise的值，则下一个then的onFulfilled会接受到此非Promise的值
// 2. 如果then的回调里，出现了异常，则会触发下一个then的onRejected
// 3. 如果then的回调里返回的是promise：
//  3.1 promise的状态为fulfilled，则会触发下一个then的onFulfilled。
//  3.2 promise的状态为rejected，则会触发下一个then的onRejected。
// 4. 一个promise可以挂载多个不同then的回调,每个then里的回调拿到promise的value或reason都是同一个
// 5. then里的onFulfilled和onRejected返回的值可以是包含promise的任意值

// promise