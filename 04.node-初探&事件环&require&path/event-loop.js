function timer() {

    setImmediate(() => {
        console.log(2);
    })

    setTimeout(() => {
        console.log(1);
    }, 0)

    console.log(3);

    process.nextTick(() => {
        console.log(4);
    })
}

timer()