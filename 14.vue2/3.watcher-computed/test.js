// 以下是自我考察的伪代码，解释清楚888打印几次的问题。

<template>
  <div class="hello">
    <h1>{{ test }} {{ b }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return {
      a: 1,
      b: 2
    }
  },
  mounted() {
    setTimeout(() => {
      this.b = 7
      console.log(999);
    }, 1000)
  },
  computed: {
    test(){
      console.log(888);
      return this.a;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
