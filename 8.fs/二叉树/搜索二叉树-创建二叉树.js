// 树的基本概念
// 1. 树根：root为树根。
// 2. 树叶：最底层的子节点叫树叶。
// 3. 节点到树叶的最长节点数为高度。
// 4. 节点到根节点的节点数为深度。


// 创建一个二叉树的思路

// 1. 创建一个node class
//  1. 具有parent属性、left、right属性
// 2. 创建一个tree class
//  1. 创建一个root属性

// 3. tree的add方法
// 目标：通过一层层比较大小，决定将元素放到树叶的left还是right
// 将当前add的值和root比较，
// 将current变量指向root
// 开始while循环遍历，判断条件为current是否为undefined
// 如果大于root，将current指向current.right，同时缓存current为parent到全局中，缓存比较的结果到全局中
// 小于root同理
// 结束循环后，即可拿到parent和比较的结果，从而决定当前元素添加到parent的哪个节点上

// 4. 自定义比较器
// 将用户写的函数传入到tree实例中，代替到tree中原有的compare即可

// http://zhufengpeixun.com/jg-vue/node/tree.html#三-二叉搜索树

class Node {
    constructor(el, parent) {
        this.parent = parent;
        this.el = el;
    }
    left = null;
    right = null;
}

class Tree {

    constructor(compare) {
        this.compare = compare || this.compare;
    }

    root = null;

    compare(parent, child) {
        return parent > child;
    }

    add(el) {
        if (!this.root) {
            this.root = new Node(el, null);
            return;
        }

        let current = this.root;
        let parent = null;
        let compareRes = null;
        while (current) {
            parent = current;
            compareRes = this.compare(current.el, el);
            if (compareRes) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        const node = new Node(el, parent);
        if (compareRes) {
            parent.left = node;
        } else {
            parent.right = node;
        }

        return this.root;
    }

    // 前中后序遍历  调整顺序即可
    traverse() {
        function _traverse(root) {
            if (root == null) {
                return;
            }
            console.log(root.el);
            _traverse(root.left);
            _traverse(root.right);
        }
        _traverse(this.root);
    }

    // 将二叉树进行翻转（水平镜像翻转）
    reverseTraverse() {
        function _traverse(root) {
            if (root == null) {
                return;
            }
            let temp = root.left;
            root.left = root.right;
            root.right = temp;
            _traverse(root.left);
            _traverse(root.right);
            return root;
        }
        return _traverse(this.root);
    }

    // 通过循环前序遍历
    // 利用栈形式存储数据
    circularTraverse() { // [ 75, 35   ]  50 25 15
        function _traverse(root) {

            let arr = [];
            arr.push(root);
            while (arr.length) {
                root = arr.pop(); // 新进后出  最后push的值会被pop出来作为新的parent node
                console.log(root.el);
                if (root.right) {
                    arr.push(root.right);
                }
                if (root.left) { // 模拟前序 先打印左面
                    arr.push(root.left);
                }
            }

        }
        _traverse(this.root);
    }

    // 通过循环层级遍历
    // 利用队列存储数据
    levelTraverse() {
        function _traverse(root) {

            let arr = [];
            arr.push(root);
            while (arr.length) {
                root = arr.shift(); // 新进后出  最后push的值会被pop出来作为新的parent node
                console.log(root.el);
                if (root.left) { // 模拟前序 先打印左面
                    arr.push(root.left);
                }
                if (root.right) {
                    arr.push(root.right);
                }
            }

        }
        _traverse(this.root);
    }

}

module.exports = Tree;

// const tree = new Tree((parent, child) => { // Tree内部的逻辑 如果返回true则把child放到parent.left
//     return parent.id < child.id;
// });
// tree.add({id: 2})
// tree.add({id: 1});
// tree.add({id: 3});

// console.dir(tree, { depth: 1000 });