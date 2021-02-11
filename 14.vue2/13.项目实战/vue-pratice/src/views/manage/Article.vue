<template>
  <div>
    <div>
      <h4>客户端</h4>
      <input type="text" v-model="msg"/>
      <button @click="clickSend">发送</button>
    </div>
    <div>
      <h4>服务器</h4>
      <input type="text" />
      <button>发送</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
        msg: ''
    };
  },
  computed: {
    ...mapState(["ws"]),
  },
  methods: {
    clickSend() {
      this.ws.sendMsg(this.msg);
    },
  },
};
</script>