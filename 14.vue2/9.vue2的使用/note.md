## Vue.use是干什么的？原理是什么？
1. Vue.use是用来安装全局插件的，如Vuex、Router、VueLazyload等插件。
    1. 由于它是对全局Vue进行的操作，所以要在new Vue之前完成全局初始化的工作。
2. 具体的原理是Vue.use内部会调用插件的install方法，将Vue及用户定义的options传递给install。
3. 这样在install内部即可调用Vue的globalApi做相应的全局逻辑处理。
    1. 比如：调用Vue.mixin对beforeCreate做处理，vuex即可将store挂载到每个组件上。每个组件可以拿到用户传递进来的路由实例对象。
    2. 比如：调用Vue.drective可以自定义指令，组件即可拥有使用自定义指令的能力。
4. use内部会判断传入的插件是否已安装过，如果已安装过则不会重复安装。