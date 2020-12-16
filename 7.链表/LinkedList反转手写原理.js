const { dir } = require("console");

class Node {
    constructor(el, next) {
        this.el = el;
        this.next = next;
    }
}

// LinkList实质上是通过head将一个个node串联起来
class LinkedList {

    size = 0;
    head = null;

    findNode(index) {
        if (index > this.size) throw new Error('下标越界');

        let current = this.head;
        for (let i = 0; i < index; i++) { // 不可以使用<= 因为index对应的next就是它自己
            current = current.next;
        }
        return current;
    }

    checkRange(index) {
        if (index > this.size) throw new Error('index 超出边界');
    }

    add(index, el) {
        if (arguments.length === 1) {
            el = index;
            index = this.size;
        }
        this.checkRange(index);

        if (index === 0) {
            // 0 给head重新赋值，将原先的head挂载到新head的next上
            this.head = new Node(el, this.head);
        } else {
            // 1 先找到index的上一个node
            // 2 将上一个node的next存储到当前index的node的next上
            // 3 将当前index的node挂载到上一个node的next上

            const prevNode = this.findNode(index - 1);
            prevNode.next = new Node(el, prevNode.next);

        }

        this.size++;
    }

    remove(index) {
        this.checkRange(index);
        if (!this.head) return null;

        // 1. 找到当前index的上一个节点
        // 2. 定义变量缓存要删除的节点
        // 3. 把上一个节点prevNode的next.next给到prevNode.next即可删除

        const prevNode = this.findNode(index - 1);
        const removedNode = prevNode.next;
        prevNode.next = prevNode.next.next;

        return removedNode.next;
    }

    set(index, el) {
        this.add(index, el);
    }

    get(index) {
        return this.findNode(index);
    }

    reverse() {
        const newLL = new LinkedList
        for(let i = 0; i < this.size; i++) {
            newLL.head.next = this.head.next;

            this.head = newLL.head;

        }

        return newLL;
    }

}

const ll = new LinkedList
ll.add(1)
ll.add(2)
ll.add(3)
const newLL = ll.reverse()

console.dir(ll, { depth: 1000 });
console.dir(newLL, { depth: 1000 });