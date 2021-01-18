<template>
  <div id="app">
    {{this.$store.state.name}}
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  mounted() {
    setTimeout(
      () => {
        this.$store.state.name = 2
      }, 3000
    )
  }
}
</script>

<style>
</style>
