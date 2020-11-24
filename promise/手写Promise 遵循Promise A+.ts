// const promise = new Promise((resovle, reject) => {
//   resovle(1);
// })

enum PromiseStatus {
  pending = "pending",
  fulfilled = "fulfilled",
  rejected = "rejected",
}

interface IResolve {
  (value: any): void;
}

interface IReject {
  (reason: any): void;
}

interface IExcutor {
  (resolve: IResolve, reject: IReject): void;
}

class MyPromise {
  status = PromiseStatus.pending;
  value: any;
  reason: any;
  constructor(excutor: IExcutor) {
    const resolve: IResolve = (value: any) => {
      if(this.status === PromiseStatus.pending) { // 只有是pending状态 才能执行， 也意味着promise的状态不可逆
        this.status = PromiseStatus.fulfilled;
        this.value = value;
      }
    }

    const reject: IReject = (reason: any) => {
      if(this.status === PromiseStatus.pending) { // 只有是pending状态 才能执行， 也意味着promise的状态不可逆
        this.status = PromiseStatus.rejected;
        this.reason = reason;
        throw new Error(reason)
      }
    }

    excutor(resolve, reject);
  }
}

const promise = new MyPromise((resolve: IResolve, reject: IReject) => {
  reject(1);
});

promise.reason = 2;

console.log(promise);
