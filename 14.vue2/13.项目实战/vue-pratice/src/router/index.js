import Vue from 'vue'
import VueRouter from 'vue-router'
import hooks from './hooks';

Vue.use(VueRouter)

// require.context为webpack里的代码  代表可以按照某种规则批量读写文件
const files = require.context('./', false, /\.router.js$/) // false 代表不读取子目录， 第三个参数可以根据正则匹配对应的文件
let routes = [];
files.keys().forEach(key => {
  const module = files(key)
  routes = [...routes, ...module.default]
})

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

Object.values(hooks).forEach(hook => {
  router.beforeEach(hook.bind(router))
})

export default router
