<template>
  <el-row class="header-row">
    <el-col :span="18">
      <img src="@/assets/logo.png" alt="logo" class="logo" />
      <!-- router true 表示menu-item是router-link -->
      <el-menu
        class="menu"
        mode="horizontal"
        background-color="#333"
        text-color="#fff"
        active-text-color="fff"
        :router="true"
      >
        <el-menu-item index="/">home</el-menu-item>
        <el-menu-item index="/article">publish article</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="6">
      <el-menu
        class="nav-right"
        mode="horizontal"
        background-color="#333"
        text-color="#fff"
        active-text-color="fff"
      >
        <template v-if="!hasPermission">
          <el-menu-item index="login">
            <router-link to="/user/login">登录</router-link>
          </el-menu-item>
          <el-menu-item index="registry">
            <router-link to="/user/registry">注册</router-link>
          </el-menu-item>
        </template>
        <template v-else>
          <el-submenu index="profile">
            <template slot="title">{{ userInfo.username }}</template>
            <el-menu-item index="logout" @click="clickLogout"
              >退出登录</el-menu-item
            >
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import * as types from "../store/action-types";

const {
  mapState: userMapState,
  mapActions: userMapActions,
} = createNamespacedHelpers("user");
export default {
  computed: {
    ...userMapState(["hasPermission", "userInfo"]),
  },
  methods: {
    ...userMapActions([types.USER_LOGOUT]),
    clickLogout() {
      console.log("click");
      this[types.USER_LOGOUT]();
    },
  },
};
</script>

<style lang="scss">
.header-row {
  height: 100%;
  .logo {
    height: 50px;
    margin: 5px;
  }
  .menu,
  .logo {
    display: inline-block;
  }
  .menu {
    height: 60px;
  }
  .nav-right {
    float: right;
    a {
      color: #fff;
      text-decoration-line: none;
    }
  }
}
</style>
