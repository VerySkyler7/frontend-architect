Promise.resolve()
.then(() => {

    Promise.resolve()
    .then(() => console.log(1))
    .then(() => Promise.resolve())
    .then(() => console.log(2))

    return Promise.resolve()
           .then(() => console.log(3))
           .then(() => console.log(4))

})
.then(() => console.log(5))
.then(() => console.log(6))

// 队列： [1 3 空then 4 空then 5 2 6]
// 打印：1 3 4 5 2 6