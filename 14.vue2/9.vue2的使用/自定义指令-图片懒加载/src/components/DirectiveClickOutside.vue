<template>
  <div class="box" v-click-outside.yyy.yy="hide">
    <input type="text" @focus="show" v-test="hide" />
    <div v-show="isShow">hahaha</div>
  </div>
</template>

<script>
// 自定义指令的核心就是操作dom，给dom绑定事件
// 自定义指令的实现方式：
// 可以通过Vue.directive创建全局指令，在vm的options中通过directives创建组件内部指令
// directive需要实现bind和unbind两个方法，分别是在创建组件和销毁组件的时候被调用
// 通过bind里的参数，可以获取到指令所挂载的真实dom，指令所使用的名字、value、modifiers(装饰器)，及组件的虚拟node
// (核心)bind里可以通过el操作真实dom，通常是绑定一些dom事件，如clickOutside、scroll事件(懒加载)。

import Vue from 'vue'

Vue.directive('test', {
  bind(el, bindings){ // ？？？指令的bind方法是在patch时创建完真实el运行的
    console.log(el, bindings);
  },
  unbind(){}
})

export default {
  name: "ClickOutside",
  directives: {
    // clickOutside() { // bind + run
    //     console.log(111);
    // }
    clickOutside: {
      // bind + unbind
      bind(el, bindings, vnode) {
        // bindings 为属性可以获取modifiers(修饰器 yyy: true yy: true)、expression(hide)、name(click-outside)、rawname(v-click-outside.yyy.yy)
        console.log(el, bindings, vnode);

        const handler = (e) => {
          console.log(e.target);
          if (!el.contains(e.target)) {
            // 点击的是box外边
            let fn = vnode.context[bindings.expression]; // hide
            fn();
          }
        };
        el.handler = handler;
        // 只要点击的不是box中的内容就隐藏掉
        document.addEventListener("click", handler);
      },
      unbind(el) {
        // 卸载组件的时候会被执行
        console.log("remove");
        document.removeEventListener("click", el.handler);
      },
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
  },
};
</script>

<style>
.box {
  display: inline-flex;
  flex-direction: column;
  border: 1px solid red;
}
</style>