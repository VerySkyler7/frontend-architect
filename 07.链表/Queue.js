const LinkedList = require("./LinkedList");

class Queue {
    constructor() {
        this.link = new LinkedList
    }

    add(el) {
        this.link.add(el)
    }

    offer() {
        return this.link.remove(0);
    }
}

module.exports = Queue;

// let queue = new Queue()
// queue.add({a: 1})
// queue.add({b: 1})
// queue.add({c: 1})
// console.log(queue.offer());
// console.dir(queue, { depth: 1000 });