const eventEmiter = require('./events源码实现');
// const eventEmiter = require('events');
const util = require('util');

function Test() {
}

util.inherits(Test, eventEmiter);

t = new Test()

// t.on('newListener', (type) => {
//   process.nextTick(()=> {
//     t.emit(type)
//   })
// })
a = (a) => {
  console.log(2);
}
t.once('a', a)

t.off('a', a)

t.emit('a')

// t.on('a', (a) => {
//   console.log(2);
// })  