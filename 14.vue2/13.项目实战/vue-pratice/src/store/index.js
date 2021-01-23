import Vue from 'vue'
import Vuex from 'vuex'
import rootModule from './rootModule'

Vue.use(Vuex)

const files = require.context('./modules/', false, /\.js$/)
const stores = {}
files.keys().forEach(key => { // key为每一个文件路径
  const store = files(key).default; // files(key) 可以拿到文件的导出值
  const moduleName = key.replace(/^\.\//, '').replace(/\.js$/, '')
  const modules = rootModule.modules = rootModule.modules || {}
  modules[moduleName] = store;
  modules[moduleName].namespaced = true;
})
export default new Vuex.Store(rootModule)
