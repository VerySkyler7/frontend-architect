<template>
  <div id="app" @click="clickApp">
    {{this.$store.state.name}}
  </div>
</template>

<script>

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
