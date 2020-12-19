/******************需强化**********************/
function runAsync(x) {
    const p = new Promise(resolve =>
        setTimeout(() => resolve(x, console.log(x)), 1000)
    );
    return p;
}
function runReject(x) {
    const p = new Promise((res, rej) =>
        setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
    );
    return p;
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
    .then(res => console.log(res))
    .catch(err => console.log(err));

/*******************需强化*********************/
function runAsync(x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000));
    return p;
}
Promise.race([runAsync(1), runAsync(2), runAsync(3)])
    .then(res => console.log("result: ", res))
    .catch(err => console.log(err));

/*******************需强化*********************/

Promise.resolve()
    .then(() => {
        return new Error("error!!!");
    })
    .then(res => {
        console.log("then: ", res);
    })
    .catch(err => {
        console.log("catch: ", err);
    });

/****************************************/

const promise = new Promise((resolve, reject) => {
    resolve("success1");
    reject("error");
    resolve("success2");
});

promise
    .then(res => {
        console.log("then: ", res);
    })
    .catch(err => {
        console.log("catch: ", err);
    });

/****************************************/

const promise = new Promise((resolve, reject) => {
    console.log(1);
    resolve();
    console.log(2);
});
promise.then(() => {
    console.log(3);
});
console.log(4);

/****************************************/

let p1 = new Promise(function (resolve, reject) {
    reject(42);
});
p1.catch(function (value) {
    console.log(value);
    return value + 1;
}).then(function (value) {
    console.log(value);
});

/****************************************/

let p1 = new Promise(function (resolve, reject) {
    resolve(42);
});
let p2 = new Promise(function (resolve, reject) {
    reject(43);
});
p1.then(function (value) {
    console.log(value);
    return p2;
}).then(function (value) {
    console.log(value);
});

/****************************************/

setTimeout(() => {
    console.log("timer1");
    Promise.resolve().then(() => {
        console.log("promise1");
    });
});

Promise.resolve().then(() => {
    console.log("promise2");
    setTimeout(() => {
        console.log("timer2");
    });
});
/****************************************/
Promise.resolve()
    .then(() => {
        Promise.resolve()
            .then(() => {
                console.log(1);
            })
            .then(() => {
                console.log(2);
            });
    })
    .then(() => {
        console.log(3);
    });

/****************************************/

async function async1() {
    await async2();
    console.log("async1 end");
}

async function async2() {
    console.log("async2 end");
}

async1();
console.log(10);

/****************************************/

console.log("start");

async function async1() {
    await async2();
    console.log("async1 end");
}

async function async2() {
    console.log("async2 end");
    // return Promise.reject(1);
}

async1();
setTimeout(function () {
    console.log("setTimeout");
});

new Promise(resolve => {
    console.log("Promise");
    resolve();
})
    .then(() => {
        console.log("promise1");
    })
    .then(() => {
        console.log("promise2");
    });

console.log("script end");

/****************************************/
let a;
const b = new Promise((resolve, reject) => {
    console.log("promise1"); // 1
    resolve();
})
    .then(() => {
        console.log("promise2"); // 4
    })
    .then(() => {
        console.log("promise3"); // 5
    })
    .then(() => {
        console.log("promise4"); // 6
    });

a = new Promise(async (resolve, reject) => {
    resolve(true);
    console.log(a); //  2  undefined;
    await b;
    console.log(a); // 7 promise fulfiled
    console.log("after1"); // 8

    await a;
    console.log("after2"); // 9
});

console.log("end"); // 3

/****************************************/
function runAsync(x) {
    const p = new Promise(resolve =>
        setTimeout(() => resolve(x, console.log(x)), 1000)
    );
    return p;
}
function runReject(x) {
    const p = new Promise((res, rej) =>
        setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
    );
    return p;
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
    .then(res => console.log(res))
    .catch(err => console.log(err));

/****************************************/
function runAsync(x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000));
    return p;
}
Promise.race([runAsync(1), runAsync(2), runAsync(3)])
    .then(res => console.log("result: ", res))
    .catch(err => console.log(err));

/****************************************/
async function async1() {
    console.log("1");
    new Promise(resolve => {
        console.log("2");
    });
    console.log("3");
}
async1();
console.log("4");

/****************************************/
async function async1() {
    console.log("1"); // 1
    await async2();
    console.log("2"); // 4
}
async function async2() {
    setTimeout(() => {
        console.log("3"); // 5
    }, 0);
    console.log("4"); // 2
}
async1();
console.log("5"); // 3

/****************************************/
async function async1() {
    console.log("1");
    await async2();
    console.log("2");
    setTimeout(() => {
        console.log("3");
    }, 0);
}
async function async2() {
    setTimeout(() => {
        console.log("4");
    }, 0);
    console.log("5");
}
async1();
setTimeout(() => {
    console.log("6");
}, 0);
console.log("7");

/****************************************/
async function async1() {
    console.log("1");
    await new Promise(resolve => {
        console.log("2");
    });
    console.log("3");
    return "4";
}
console.log("5");
async1().then(res => console.log(res));
console.log("6");

/****************************************/
async function async1() {
    console.log("1");
    await new Promise(resolve => {
        console.log("2");
        resolve("3");
    }).then(res => console.log(res));
    console.log("4");
    return "5";
}
console.log("6");
async1().then(res => console.log(res));
console.log("7");

/****************************************/
async function async1() {
    console.log("1");
    await new Promise(resolve => {
        console.log("2");
        resolve("3");
    });
    console.log("4");
    return "5";
}
console.log("6");
async1().then(res => {
    console.log(res);
});
new Promise(resolve => {
    console.log("7");
    setTimeout(() => {
        console.log("8");
    });
});
/****************************************/
async function testSomething() {
    console.log("1");
    return "2";
}

async function testAsync() {
    console.log("3");
    return Promise.resolve("4");
}

async function test() {
    console.log("5");
    const v1 = await testSomething();
    console.log(v1);
    const v2 = await testAsync();
    console.log(v2);
    console.log(v1, v2);
}

test();

var promise = new Promise(resolve => {
    console.log("6");
    resolve("7");
});
promise.then(val => console.log(val));

console.log("8");

/****************************************/

async function async1() {
    await async2();
    console.log("async1");
    return "async1 success";
}
async function async2() {
    return new Promise((resolve, reject) => {
        console.log("async2");
        reject("error");
    });
}
async1().then(res => console.log(res));

/****************************************/

async function async1() {
    try {
        await Promise.reject("error!!!");
    } catch (e) {
        console.log(e);
    }
    console.log("async1");
    return Promise.resolve("async1 success");
}
async1().then(res => console.log(res));
console.log("script start");

/****************************************/
async function async1() {
    await Promise.reject("error!!!").catch(e => console.log(e));
    console.log("async1");
    return Promise.resolve("async1 success");
}
async1().then(res => console.log(res));
console.log("script start");

/****************************************/

const first = () =>
    new Promise((resolve, reject) => {
        console.log(3); // 1
        let p = new Promise((resolve, reject) => {
            console.log(7); // 2
            setTimeout(() => {
                console.log(5); // 6
                resolve(6);
                console.log(p); // 7  promise fulfilded 1
            }, 0);
            resolve(1);
        });
        resolve(2);
        p.then(arg => {
            console.log(arg); // 4   1
        });
    });
first().then(arg => {
    console.log(arg); // 5    2
});
console.log(4); // 3

/****************************************/

const async1 = async () => {
    console.log("async1");
    setTimeout(() => {
        console.log("timer1");
    }, 2000);
    await new Promise(resolve => {
        console.log("promise1");
    });
    console.log("async1 end");
    return "async1 success";
};
console.log("script start");
async1().then(res => console.log(res));
console.log("script end");
Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .catch(4)
    .then(res => console.log(res));
setTimeout(() => {
    console.log("timer2");
}, 1000);

/****************************************/

const p1 = new Promise(resolve => {
    setTimeout(() => {
        resolve("resolve3");
        console.log("timer1");
    }, 0);
    resolve("resolve1");
    resolve("resolve2");
})
    .then(res => {
        console.log(res);
        setTimeout(() => {
            console.log(p1);
        }, 1000);
    })
    .finally(res => {
        console.log("finally", res);
    });

/****************************************/

// 1.使用Promise实现每隔1秒输出1, 2, 3; 用 promise 来做;
// 2. 使用Promise实现红绿灯交替重复亮
// function red() {
//   console.log("red");
// }
// function green() {
//   console.log("green");
// }
// function yellow() {
//   console.log("yellow");
// }

// 3.实现mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中。
const time = timer => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timer);
    });
};
const ajax1 = () =>
    time(2000).then(() => {
        console.log(1);
        return 1;
    });
const ajax2 = () =>
    time(1000).then(() => {
        console.log(2);
        return 2;
    });
const ajax3 = () =>
    time(1000).then(() => {
        console.log(3);
        return 3;
    });

function mergePromise() {
    // 在这里写代码
}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
    console.log("done");
    console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]

// 4. 手写一个promise;

/**************/

Promise.resolve()
    .then(() => {
        Promise.resolve()
            .then(() => console.log(1)) // 1
            .then(() => Promise.resolve())
            .then(() => console.log(5));

        return Promise.resolve()
            .then(() => console.log(2)) // 2
            .then(() => console.log(4));
    })
    .then(() => console.log(6))
    .then(() => console.log(7));
