<template>
  <div class="box" v-click-outside.yyy.yy="hide">
    <input type="text" @focus="show" />
    <div v-show="isShow">hahaha</div>
  </div>
</template>

<script>
// 自定义指令的核心就是操作dom，给dom绑定事件

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