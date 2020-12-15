// 单链表适合针对head头的操作，其余的性能没有数组性能高，数组在删除头部时会造成数组塌陷，性能不高
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

    // 获取index所在节点
    _node(index) {
        let current = this.head;
        if(!current) return current; // 越界判断

        for(let i = 0; i < index; i++) {
            current = current.next;
            if(!current) return current; // 越界判断 此行和上一行调换位置会多循环一次，对结果没影响
        }
        return current;
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
            // 目标：将当前节点插入的index位置上，之前index位置的节点向后顺延
            // 找到当前位置的前一个节点prevNode，将prevNode的next替换成当前节点。
            // 将当前节点的next换成prevNode的next
            let prevNode = this._node(index-1)
            prevNode.next = new Node(el, prevNode.next);

        }
        this.size += 1;
    }

    remove() {

    }

}

let ll = new LinkedList()
ll.add(0, 1)
ll.add(0, 2)
ll.add(1, 3)

console.dir(ll, { depth: 1000 });