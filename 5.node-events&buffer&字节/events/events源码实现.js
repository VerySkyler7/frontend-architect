function events () {
	this.cbs = {};
}

events.prototype.on = function (name, cb) {
    if(!this.cbs) this.cbs = {};
    if(!this.cbs[name]) this.cbs[name] = [];
    if(name !== 'newListener') {
        this.emit('newListener', name);
    }
	const cbArr = this.cbs[name];
	cbArr.push(cb);
}

events.prototype.emit = function (name, ...args) {
	if(!this.cbs) this.cbs = {};
	if(!this.cbs[name]) this.cbs[name] = [];
  const cbArr = this.cbs[name];
	cbArr.forEach(fn => fn(...args));
}

events.prototype.off = function (name, fn) {
  if(!this.cbs) this.cbs = {};
  if(!this.cbs[name]) this.cbs[name] = [];
  const cbArr = this.cbs[name];
  // 要把不需要关闭的过滤出来
  
  this.cbs[name] = cbArr.filter(item => {
    (item !== fn && item.l !== fn)
  });
}

/**
 * once的核心点
 * 1. once是on和off的结合
 * 2. 想让函数执行后立马删除，需要利用到aop编程，将fn的运行和off包裹在一个新的函数内，此时name将和新的函数绑定在一起
 * 3. off关闭时，关闭的是新的函数，而不是fn
 * 4. emit执行的参数，需要通过aop穿透给fn
 * 5. off关闭once时，需要给fn做特殊标记，否则通过fn无法关闭自身
 */
events.prototype.once = function (name, fn) {
	const aop = (...args) => {
		fn(...args);
    this.off(name, aop);
  }
  aop.l = fn;
	this.on(name, aop);
}

module.exports = events;
