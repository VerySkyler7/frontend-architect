const eventEmiter = require('./events源码实现');
// const eventEmiter = require('events');
const util = require('util');

function Test() {
}

util.inherits(Test, eventEmiter);

t = new Test()

t.on('newListener', (type) => {
  console.log(type);
  t.emit(type)
})

t.on('a', (a) => {
  console.log(1);
})

console.log(2);

t.on('a', (a) => {
  console.log(2);
})  