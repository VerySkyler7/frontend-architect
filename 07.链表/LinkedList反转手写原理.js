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

        if (index === 0) { // 不断的往head前面添加元素
            // 0 给head重新赋值，将原先的head挂载到新head的next上，等同于：
            // obj = {}
            // obj = {next: obj}
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

    reverse() { // 容易理解的反转  正向遍历
        // 1. 新建一个LinkList
        // 2. 遍历当前的LinkList
        // 3. 把每个node添加到LinkList的头部
        const newLL = new LinkedList;
        let current = this.head;
        while (true) {
            newLL.head = new Node(current.el, newLL.head);
            newLL.size++;
            current = current.next;
            if (!current) break;
        }
        this.head = newLL.head;
        return this.head;
    }

    reverse1() { // 正向遍历  此方法可忽略
        // 1. 将链表拆成 1 [ 2 3 ]  
        //  1. temp缓存[2 3] 
        //  2. 1.next指向新头
        // 2. 新头指向1
        // 3. 将旧头指向temp
        let head = this.head;
        if (head == null || head.next == null) return head;
        let newHead = null;
        while (head != null) {
            let temp = head.next; // temp 指向 2  第二次循环时temp指向3
            // 此行不是很好理解
            head.next = newHead; // 1的next 指向newHead  第二次循环时，将2.next指向1，即实现了1和2的调换   // 第一次需要将head.next指向null   第二次需要将head的next指向原先的newHead
            newHead = head; // newHead 指向1 第二次循环newHead指向2
            head = temp; // head 指向 2 第二次循环head指向3
        }
        this.head = newHead;
        return newHead;
    }


    reverse2() { // 递归反转  重点关注此方法

        // 0. 将 1 2 3 翻转
        // 1. 通过递归找到最后一个节点3 ??为什么找从最后一个开始：因为将第一个和第二个反转后，和后面的元素没有关联
        // 2. 递归执行之前未完成的代码，此时res为3，head为2，将3的next指向2(head.next.next = head)，2的next指向null(head.next = null)。即完成了3和2的互换。
        // 3. 再次执行上一层代码时，此时head为1，1的next依旧指向的是2，2和3的位置已经互换，因此循环执行第二步即可完成1和2的互换。
        // 4. 最后将lastNode返回则拿到新的头节点

        function _reverse(head) {
            // 1.递归找到最后一个
            if (head == null || head.next == null) return head;
            const lastNode = _reverse(head.next);

            // 2. 将最后一个的next指向倒数第二个
            head.next.next = head;

            // 3. 把倒数第二个的next换成null
            head.next = null;

            // 4. 继续运行之前未运行完的递归代码

            // 5. 将lastNode返回出去
            return lastNode;
        }


        return _reverse(this.head)
    }

}

const ll = new LinkedList
ll.add(1)
ll.add(2)
ll.add(3)

// const res = ll.reverse0(ll.head)
// console.dir(res, { depth: 1000 });

console.dir(ll.reverse2(), { depth: 1000 })

// const newLL = ll.reverse1()

// console.dir(ll, { depth: 1000 });
// console.dir(newLL, { depth: 1000 });