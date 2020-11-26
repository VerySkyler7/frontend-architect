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

export function handlePromise(
  promise2: Promise,
  x: Promise,
  resolve: IResolve,
  reject: IReject
) {
  try {
    if (typeof x === "object" && x !== null && typeof x.then === "function") {
      x.then(
        (y: any) => {
          handlePromise(promise2, y, resolve, reject);
        },
        (r: any) => {
          reject(r);
        }
      );
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

  then(onFulfilled?: IFThenCB, onRejected?: IFThenCB): Promise {
    // p1
    const promise2 = new Promise((resolve, reject) => {
      // p2是p1的then的返回值
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
            if (onRejected) {
              const x = onRejected(this.reason); // p3是p1 then的回调的返回值
              // 通过p1里onFulfilled返回的p3的状态，来决定p2的状态
              handlePromise(promise2, x, resolve, reject);
            }
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

var p = new Promise((res, rej) => {
  rej(1);
}).then(
  () => {
    return new Promise((res, rej) => {
      res(2)
    });
  },
  () => {
    return new Promise((res, rej) => {
      res(new Promise((res, rej) => {
        rej(3);
      }));
    });
  }
);

p.then(
  (res) => {
    console.log(res);
    console.log(4);
  },
  (res) => {
    console.log(res);
    console.log(5);
  }
);

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
// 关于then里的onFulfilled和onRejected的返回值的问题
// 情况1：如果它两返回的是普通值，则then返回的promise的状态为fullfilled，value为普通值。
// 情况2：如果它两返回的是promise(又名p1)，则then返回的promise(又名p2)的状态取决于p1的状态
// 情况2-1：如果p1的状态是rejected，则p2的状态直接为rejected，无需关心p1的reason是否为一个promise，将p1的reason直接交个p2的reason即可
// 情况2-2：如果p1的状态是fulfilled，则需要关心p1的value是否为一个promise，如果是则需要将p1的value通过递归一直钻取到一个普通值为止，最终将这个普通值赋值给p2的value。在递归钻取的过程中，只要发现promise有rejected的状态，则会把promise的的reason给到p2的reason，从而终止递归。
// 情况3：如果p1里抛出了异常，则直接将异常交个p2的reason