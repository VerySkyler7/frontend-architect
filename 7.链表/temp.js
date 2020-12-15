class Node {
    constructor(el, next) {
        this.el = el;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    add(index, el) {
        if(arguments.length === 1) {
            el = index;
            index = this.size;
        }
        if(index == 0) {
            let oldHead = this.head;
            this.head = new Node(el, oldHead); // new Node 相当于是新的head
            // this.head = { el: 1, next: this.head }
            // this.head = { el: 2, next: this.head }
        }
    }
}

const ll = new LinkedList()
ll.add(0, 1)
ll.add(0, 2)
ll.add(3)
console.dir(ll, { depth: 1000 });