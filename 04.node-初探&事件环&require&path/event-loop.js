// - node底层有一个libuv库，使用多线程模拟的异步，有一个单独的线程管理调度同步代码和异步代码
// - 浏览器和node事件环的差异：
//   - 相同点：
//     - 在node10版本及以上执行结果是一致的。
//     - 先把主栈的同步代码及微任务执行完。
//   - 不同点：
//     - 浏览器中只有宏任务队列和微任务队列。
//     - node中有timer、pendding callback、poll、check、close callback等宏任务队列。
//     - 同步代码及微任务执行完，浏览器进入宏任务队列，node进入event loop队列。

// node事件环
// 1. 每个环节都是一个宏任务队列，主栈代码也是一个宏任务，当主栈代码执行完毕后开始处理每一个宏任务队列。
// 2. 事件环队列处理顺序 初始化事件环、timers(setTimeout) >> poll(io操作) >> check(setImmediate) >> process.nextTick
//  0. 初始化事件环：用于执行js主线程中的同步及微任务代码，nextTick处于主线程同步代码的栈底，在微任务之前运行
//  1. timers：定时器队列，用于存放setTimeout setInterval定时器的回调
//  2. IO pendding 用于存放之前未处理完的IO回调，具体把哪些放进来由系统内部决定(防止事件循环被饿死？！)
//  3. poll io操作的回调，除了timer、io关闭操作，其余的回调基本都放在这里。
//     当poll处理完后会查看后面有没有setImmediate的回调，有则继续执行往后执行event loop，没有则阻塞在poll中，等待timers的回调。timers如果没有，则一直阻塞在poll中监听I/0回调。
//  4. check 用于存放setImmediate的回调
//  5. onClose，用于存放关闭的回调如http、socket的关闭
//  6. 当所有的队列都被清空完后，libuv会将loop阻塞在poll阶段，用于监听新的io回调

// setImmediate
// setImmediate属于node专有的，在浏览器中只有ie有setImmediate。setImmediate只是node为check阶段定义的一个api，暂无其他实际应用场景。

// setTimeout
// setTimeout回调真正的执行时间 >= 用户设置的时间。如果用户设置了10ms，主栈运行耗费了20ms，则定时器回调为20ms后开始执行。如果主栈耗费了5ms，定时器回调将在5 + 5ms后开始执行。

// 扩展
// 环境(浏览器调度线程、libuv)调度的是宏任务  微任务不受环境的调度  微任务是主栈里的执行顺序
// 因此process.nextTick也不属于node的事件环  因为它是主栈里的概念

// 疑问：为什么setTimeout的回调不属于io，但是回调里的setImmediate和setTimeout的执行顺序也是确定的

function timer() {

    setTimeout(() => {
        console.log(5);
    }, 7)
    
    setImmediate(() => {
        console.log(4);
    })    

    Promise.resolve().then(() => console.log(3))

    process.nextTick(() => {
        console.log(2);
    })

    console.log(1);
    
}

timer(); // 执行顺序 123是确定的的 45要根据机器的性能，性能越差，时间越短，timer越可能提前执行。目前设置7毫秒，处于两种可能性之间。用于和下面的代码做对比
// setTimeout(timer); // 执行顺序永远是 12345
