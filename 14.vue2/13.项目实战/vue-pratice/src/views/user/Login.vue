<template>
  <div class="reg-page">
    <el-row>
      <el-col class="title">
        <h2>欢迎登录</h2>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10" :offset="7">
        <el-form
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="账号"
            prop="username"
            :rules="{ required: true }"
          >
            <el-input v-model.number="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            :rules="{ required: true }"
          >
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import * as types from "../../store/action-types";
import { v4 as uuidv4 } from "uuid";
const { mapActions: userMapActions } = createNamespacedHelpers("user");

export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...userMapActions([types.USER_LOGIN]),
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this[types.USER_LOGIN]({ ...this.ruleForm, uid: uuidv4() })
            .then(() => {
              this.$router.push("/");
            })
            .catch((err) => this.$message.error(err.data));
        } else {
          this.$message.error("提交失败");
        }
      });
    },
  },
};
</script>

<style lang="scss">
.reg-page {
  .title {
    text-align: center;
    margin: 20px;
  }
}
</style>
