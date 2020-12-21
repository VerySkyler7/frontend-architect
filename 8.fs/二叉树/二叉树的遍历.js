// 1. 前序遍历 从根节点开始遍历优先遍历左边的节点(从根到子)，遍历完左边遍历右边(每一个分支都可以重新开成一个树)
// 根节点>>左节点>>左节点... >> 右节点，有左则一直深入下去找左直到没有为止

// 2. 中序遍历 从一侧(需统一，如左侧)的叶子节点开始遍历，左侧叶子节点>>parent节点>>右侧叶子节点，依次向上遍历

// 3. 后序遍历 左侧叶子节点>>右侧叶子节点>>根节点

// 4. 层序遍历 从顶层一层一层遍历

const Tree = require('./搜索二叉树-创建二叉树')

const tree = new Tree((parent, child) => { // Tree内部的逻辑 如果返回true则把child放到parent.left
    return parent.id > child.id;
});
tree.add({ id: 50 })
tree.add({ id: 25 });
tree.add({ id: 75 });
tree.add({ id: 20 });
tree.add({ id: 30 });
tree.add({ id: 65 });
tree.add({ id: 85 });

tree.traverse();
