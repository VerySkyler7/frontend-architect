import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'test'
  },
  mutations: {
    async changeNameMutt(state, {name}) {
      const res = await new Promise((res, rej) => {
        setTimeout(() => {
          res(1)
        }, 1000)
      })
      state.name = res
    }
  },
  actions: {
    async changeNameAct({ commit }, { name }) {
      // this. action如何调用mutation
      const res = await new Promise((res, rej) => {
        setTimeout(() => {
          res(name)
        }, 1000)
      })

      commit('changeNameMutt', { name })



    }
  },
  modules: {
  }
})
