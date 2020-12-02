class Context { // 4
  constructor() {
    this.next = 0;
    this.done = false;
  }
  stop() {
    this.done = true;
  }
}

const regeneratorRuntime = {
  mark(generFun) {  // 1
    return generFun; // 最外层的generator函数
  },
  wrap(innerFn, outterFn) { // 2
    const context = new Context();
    return {
      next(val) { // 3
        const value = innerFn(context); // 5
        return {
          done: context.done,
          value
        }
      }
    }
  }
}

var _marked = regeneratorRuntime.mark(read); // read就是刚才的generator函数

function read() {
  var a, b, c;
  return regeneratorRuntime.wrap(
    function read$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return 1;

          case 2:
            a = _context.sent;
            console.log(a);
            _context.next = 6;
            return 2;

          case 6:
            b = _context.sent;
            console.log(b);
            _context.next = 10;
            return 3;

          case 10:
            c = _context.sent;
            console.log(c);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _marked);
}

const it = read();

it.next(1)