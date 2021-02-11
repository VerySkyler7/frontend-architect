<template>
  <div class="container">
    <div>
      <h4>客户端</h4>
      <input type="text" v-model="sendMsg" />
      <button @click="clickSend">发送</button>
      <div v-for="(sendMsg, index) in sendMsgArr" :key="index">
          {{sendMsg}}
      </div>
    </div>
    <div>
      <h4>服务器</h4>
      <div v-for="(receiveMsg, index) in receiveMsgArr" :key="index">
          {{receiveMsg}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      sendMsg: "",
      sendMsgArr: [],
    };
  },
  computed: {
    ...mapState(["ws", "receiveMsgArr"]),
  },
  methods: {
    clickSend() {
      this.ws.sendMsg(this.sendMsg);
      this.sendMsgArr.push(this.sendMsg);
      this.sendMsg = "";
    },
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
}
</style>