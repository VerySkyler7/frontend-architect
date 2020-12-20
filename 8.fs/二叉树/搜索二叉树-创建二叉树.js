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