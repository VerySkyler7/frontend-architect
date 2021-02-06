<template>
  <el-container id="app" style="min-width:1000px;">
    <el-header>
      <page-header></page-header>
    </el-header>
    <el-main><router-view></router-view></el-main>
    <el-footer>
      <page-footer></page-footer>
    </el-footer>
  </el-container>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import PageFooter from "@/components/PageFooter";

export default {
  name: "app",
  components: {
    PageHeader,
    PageFooter,
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

// 
.el-header {
  background-color: #333;
}

.el-footer {
  background-color: #333;
}

.el-main {
  height: calc(100vh - 120px);
}
</style>
