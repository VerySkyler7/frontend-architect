class Node {
	constructor(el, next) {
		this.el = el;
		this.next = next;
	}
}

class LinkedList {
	head = null;
	size = 0;

	add(index, el) {
		if (arguments.length === 1) {
			el = index;
			index = this.size;
		}

		if (index === 0) {
			this.head = new Node(el, this.head);
		} else {
			let prevNode = this.findNode(index - 1)
			prevNode.next = new Node(el, prevNode.next);
		}

		this.size++;
	}

	// 画图最容易理解
	reverse() {

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

		this.head = _reverse(this.head);
		return this.head;
	}

	remove(index) {
		const prevNode = this.findNode(index - 1);
		let removedNode = prevNode.next;
		if(!prevNode.next) return null;
		prevNode.next = prevNode.next.next;
		this.size--;
		return removedNode;
	}

	set(index, el) {
		const current = this.findNode(index);
		current.el = el;
	}

	get(index) { 
		return this.findNode(index);
	}

	findNode(index) {
		if (index > this.size) {
			throw new Error('下标越界');
		}

		let current = this.head;
		for (let i = 0; i < index; i++) {
			current = current.next;
		}
		return current;
	}
}

const ll = new LinkedList()
ll.add(1)
ll.add(2)
ll.add(3)
ll.add(4)
ll.remove(3);
ll.set(2, '2.5');
ll.get(2);
console.dir(ll, { depth: 1000 });

ll.reverse();
console.dir(ll, { depth: 1000 });

