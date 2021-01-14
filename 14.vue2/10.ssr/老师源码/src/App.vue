<template>
  <div id="app"> <!-- 服务端渲染需要在最外层div上加上id="app",否则无法激活client.bundle.js -->
      <Foo></Foo>
      <Bar></Bar>
  </div>
</template>
<script>
import Bar from './components/Bar.vue';
import Foo from './components/Foo.vue'
export default {
    components:{
        Bar,
        Foo
    }
}
</script>
