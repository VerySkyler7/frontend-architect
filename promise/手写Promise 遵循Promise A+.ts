const promise = new Promise((resovle, reject) => {
  resovle(1);
})

enum PromiseStatus {
  pending = "pending",
  fulfilled = "fulfilled",
  rejected = "rejected",
}

class MyPromise {
  status: PromiseStatus;
  constructor(excutor) {
    const resolve = (value: any) => {
      if(this.status === PromiseStatus.pending) { // 只有是pending状态 才能执行， 也意味着promise的状态不可逆
        this.status = PromiseStatus.fulfilled;
      }
    }

    const reject = (reason: any) => {
      if(this.status === PromiseStatus.pending) { // 只有是pending状态 才能执行， 也意味着promise的状态不可逆
        this.status = PromiseStatus.rejected;
      }
    }

    excutor(resolve, reject);
  }
}