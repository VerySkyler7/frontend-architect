Function.prototype.unCurrying = function () {
  return (...args) => {
    // 这里可以直接使用this.call,但这样不安全，有可能方法本身被注入的call方法
    // 谁调用了unCurrying，this就指向谁
    // 当slice调用unCurrying时，this就指向slice函数
    // Function.prototype.call为一个函数，不能独立使用，只能通过函数调用。
    // call本身即为一个函数，通过call.call的方式将函数传递给第二个call，就相当于是函数调用call方法，
    // 因为第二个call相当于在执行第一个call，此时第一个call需要传递一个this，这个this就是目标函数。
    return Function.prototype.call.call(this, ...args);
  }
}

const mySlice = [].slice.unCurrying();

console.log(mySlice('abc')); // [a, b, c]