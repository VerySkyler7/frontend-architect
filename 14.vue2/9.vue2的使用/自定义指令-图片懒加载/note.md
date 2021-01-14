# 自定义指令
- 自定义指令的核心就是操作dom，给dom绑定事件
- 自定义指令的实现方式：
- 可以通过Vue.directive创建全局指令，在vm的options中通过directives创建组件内部指令
- directive需要实现bind和unbind两个方法，分别是在创建组件和销毁组件的时候被调用
- 通过bind里的参数，可以获取到指令所挂载的真实dom，指令所使用的名字、value、modifiers(装饰器)，及组件的虚拟node
- (核心)bind里可以通过el操作真实dom，通常是绑定一些dom事件，如clickOutside、scroll事件(懒加载)。


# 图片懒加载原理
插件的定义：导出一个对象，里面包含install方法，可以获取到大Vue和用户传入的options。install中定义全局指令，bind对应scroll方法。
核心原理：
1. 找到需要进行滚动的父元素，绑定滚动事件。需要通过节流介绍滚动事件的触发。
2. 获取元素距离当前屏幕的位置，如果在屏幕内则通过创建Imgage进行加载图片，加载后挂载到el的src上。
3. 给每个el增加标识，判断是否需要加载，如果已加载过则不需要加载。