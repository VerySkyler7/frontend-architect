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
  fulfilledFns: Function[] = [];
  rejectedFns: Function[] = [];

  constructor(executor: IExecutor) {
    const resolve: IResolve = (value: any) => {
      if (this.state === STATE.PENDING) {
        this.state = STATE.FULFILLED;
        this.value = value;
        this.fulfilledFns.forEach((fn) => fn(this.value));
      }
    };
    const reject: IReject = (reason: any) => {
      if (this.state === STATE.PENDING) {
        this.state = STATE.REJECTED;
        this.reason = reason;
        this.rejectedFns.forEach((fn) => fn(this.reason));
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled?: Function, onRejected?: Function) {
      if(this.state === STATE.PENDING) {
          onFulfilled && this.fulfilledFns.push(onFulfilled);
          onRejected && this.rejectedFns.push(onRejected);
      }
  }
}

const p = new Promise((resolve, reject) => {
  console.log(1);
  reject(4);
  console.log(2);
});

p.then(
  (res: any) => {
    console.log(res);
  },
  (res: any) => {
    console.log(res);
  }
);

console.log(3);
