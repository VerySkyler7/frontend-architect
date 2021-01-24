import { getSlider } from '../api/public'
import * as types from './action-types'

export default {
    state: {
        sliders: []
    },
    mutations: {
        async [types.SET_SLIDERS](state, payload) {
            state.sliders = payload;
        }
    },
    actions: {
        async [types.SET_SLIDERS]({commit}) {
            let {data} = await getSlider()
            commit(types.SET_SLIDERS, data)
        }
    },
    modules: {
    }
  }