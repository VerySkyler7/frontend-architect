const { get } = require("http");

class Node {
    constructor(el, next) {
        this.el = el;
        this.next = next
    }
}

class LinkedList {

    constructor() {
        this.head = null
        this.size = 0
    }

    add(index, el) { // 直接向后追加，根据索引追加, 遇到头部放到最前面
        if(arguments.length === 1) {
            el = index;
            index = this.size; 
        }
        if(index === 0) {
            let head = this.head; // 获取旧的头部
            this.head = new Node(el, head) // 把新的el设置成最新的头
        } else {
            // 找到当前位置对应的节点，将这个节点替换成新的节点，并且让新的节点指向原来的节点
            let oldNode = get(index)

        }
        this.size += 1;
    }

    remove() {

    }

}

let ll = new LinkedList()
ll.add(0, 1)
ll.add(0, 2)
ll.add(0, 10)

console.dir(ll, {depth: 4111});