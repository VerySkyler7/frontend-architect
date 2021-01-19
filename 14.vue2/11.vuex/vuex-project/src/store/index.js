import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'test'
  },
  mutations: {
    changeNameMutt(state, payload){
      state.name = payload.name
    }
  },
  actions: {
    changeNameAct(){
      // this. action如何调用mutation
    }
  },
  modules: {
  }
})
