/****************************************/
// 每隔一秒输出1、2、3
const print = () => new Promise(r => {
    let s = setTimeout(() => {
        r();
        clearTimeout(s);
    }, 1000);
});

async function run() {
    for(let i = 1; i < 4; i++) {
        await print();
        console.log(i);
    }
}

// run();

/****************************************/
// 红绿灯  2秒红 1秒黄 3秒绿 无限循环
const light = (t) => new Promise(r => {
    let s = setTimeout(() => {
        r();
        clearTimeout(s);
    }, t * 1000)
})

async function run1() {
    await light(2);
    yellow();
    await light(1);
    green();
    await light(3);
    red();
    run1();
}

// run1();

function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}

/****************************************/
// 实现mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中。
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

async function mergePromise(arr) {
    // 在这里写代码
    // let newArr = [];
    // for(let i = 0; i < arr.length; i++){
    //     let res = await arr[i]();
    //     newArr.push(res);
    // }
    // return newArr;
}

// mergePromise([ajax1, ajax2, ajax3]).then(data => {
//     console.log("done");
//     console.log(data); // data 为 [1, 2, 3]
// });

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]