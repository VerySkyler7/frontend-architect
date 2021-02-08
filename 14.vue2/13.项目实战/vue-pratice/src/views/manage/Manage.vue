<template>
  <div class="manageContainer">
    <my-menu></my-menu>
    <router-view></router-view>
  </div>
</template>
<script>
import MyMenu from "@/components/MyMenu";
export default {
  name: "Manage",
  components: {
    MyMenu,
  },
};
</script>

<style lang="scss">
    .manageContainer {
        display: flex;
    }
</style>