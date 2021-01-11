<template>
  <div class="hello">
    <h1>{{ a }}</h1>
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
      a: 1
    }
  },
  created(){
    if(!window.arr123) window.arr123 = []
    window.arr123.push(this)
  },
  mounted(){
    console.log(666);
  },
  aaa: {
    test: 1
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
