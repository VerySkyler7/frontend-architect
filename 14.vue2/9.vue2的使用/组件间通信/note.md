# 组件通信的方式
- props和$emit 父组件向子组件传递数据是通过prop传递的，子组件传递数据给父组件是通过$emit触发事件来做到的
- ？？$attrs和$listeners A->B->C。Vue 2.4 开始提供了$attrs和$listeners来解决这个问题
- ？？$parent,$children是指获取实例吗？
- $refs 获取实例
- 父组件中通过provider来提供变量，然后在子组件中通过inject来注入变量。类似context
？？- envetBus 平级组件数据传递 这种情况下可以使用中央事件总线的方式
- vuex状态管理