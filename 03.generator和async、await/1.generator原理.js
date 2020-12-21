/**
 * generator源码核心思路
 * 1. 定义一个context上下文对象，将next属性作为指针，done作为完成状态。
 * 2. 定义一个innerFn，通过switch(context.next)定义yeild对应的代码块。（有n个yeild，则划分n+1个代码块）innerFn的返回值是用户调用next返回的value值。
 * 3. 如果yeild前面有返回值，则在innerFn函数外部定义n个单独的变量，用于存放每个yeild前面的返回值
 * 4. 用户每次调用next方法时，则调用innerFn函数，在innerFn内部通过context.next指针找到对应的代码块执行代码块，同时将context.next指针向后移动一位。
 * 5. 如果next函数执行时有参数，则把next的参数赋值给innerFn外部的变量。（通过context.next找到对应的变量进行赋值）
 * 6. 运行到最后一个代码块则把context中的done设置为true。
 */

class Context {  
  constructor() {
    this.next = 0;  //1 代码块指针，用于触发next函数时，执行指针对应的代码块
    this.done = false;
  }
  stop() {
    this.done = true;
  }
}

const regeneratorRuntime = {
  wrap(innerFn) { 
    const context = new Context();
    return {
      next(val) {  // 2 每次执行innerFn，根据context.next执行对应的代码块，同时将指针向后移一位
        const value = innerFn(context, val);
        return {
          done: context.done,
          value
        }
      }
    }
  }
}

function read() {
  var a, b, c;
  return regeneratorRuntime.wrap(
    function read$(_context, sent) { 
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return 'a';

          case 2:
            a = sent;
            console.log(a);
            _context.next = 6;
            return 'b';

          case 6:
            b = sent;
            console.log(b);
            _context.next = 10;
            return 'c';

          case 10:
            c = sent;
            console.log(c);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    });
}

const it = read();

console.log(it.next(0));
console.log(it.next(1));
console.log(it.next(2));
console.log(it.next(3));