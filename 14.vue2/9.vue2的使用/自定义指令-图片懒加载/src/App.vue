<template>
  <div id="app">
    <HelloWorld v-if="isShow"/>
    <HelloWorld1 v-else />
    <button @click="clickBtn">切换</button>
  </div>
</template>

<script>
import HelloWorld from './components/LazyLoad.vue'
import HelloWorld1 from './components/ComputedDirty.vue'

export default {
  name: 'App',
  data() {
    return {
      isShow: true
    }
  },
  methods: {
    clickBtn() {
      this.isShow = !this.isShow
    }
  },
  components: {
    HelloWorld,
    HelloWorld1
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
