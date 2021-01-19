<template>
  <div id="app" @click="clickApp">
    {{this.$store.state.name}}
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  methods: {
    clickApp() {
      this.$store.commit('changeNameMutt', {
        name: 'wp'
      })
    }
  },
}
</script>

<style>
</style>
