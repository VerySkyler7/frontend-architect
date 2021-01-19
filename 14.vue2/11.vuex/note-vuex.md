## vuex 获取数据的用法及实现原理
1. 在组件中，通过$store.state获取store中的数据
``` js
<template>
  <div id="app">
    {{this.$store.state.name}}
  </div>
</template>
```
2. 如何做到更改store.state，更新使用了它的组件？
    1. 初始化store时，创建一个new Vue实例vm，将store的state存储到vm的data.$$state上(内部会将$开头的数据存放到_data上，但不会代理到vm上，提升性能，减少一次代理)
    2. 这样store上的state数据即变成响应式数据。当在组件中通过store获取state时，会触发vm._data.$$state，会对$$state上的数据进行依赖收集。
    3. $$state的值发生变化时，会通过$$state对应的依赖触发其渲染watcher更新相应的组件。(每个组件都会对应一个自己的渲染watcher，所以通过watcher可以找到对应的组件)

## vuex是如何让每个组件都可以访问store的 (父组件传球)
1. 在Vue.use(Vuex)时，会调用Vuex的install方法，install方法中通过Vue.mixin创建beforeCreate。
2. 在beforeCreate中将根组件的store赋值给vm.$store，在遍历组件tree的时候，依次通过vm.$parent找到$store将其挂载到自己身上。

## store中state及getter的实现原理 (抽象组件搭桥)
1. store内部创建了一个抽象组件，通过store的state代理了抽象组件的data中的$$state。通过getter代理了抽象组件的。
2. 这样在组件中获取store中的state时，真正获取的是抽象组件的$$state，由于组件的data是响应式数据，所以抽象组件的$$state会收集组件的渲染watcher。
3. 同样在组件中获取store的getters的方法时，真正获取的是抽象组件的computed，此时computed对应的方法会被执行，方法内部的data会收集当前的computed watcher和渲染watcher。
4. 因此当store的state发生变化时，真正变化的是抽象组件的响应式数据，会触发对应的watcher进行渲染。

## vuex 更改数据的用法及实现原理
```

```