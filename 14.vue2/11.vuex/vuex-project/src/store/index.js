import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'test'
  },
  mutations: {
    changeNameMutt(state, payload){
      setTimeout(() => {
        state.name = payload.name
      }, 2000)
    }
  },
  actions: {
    changeNameAct(){
      
    }
  },
  modules: {
  }
})
