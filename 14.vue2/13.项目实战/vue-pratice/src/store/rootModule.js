import { getSlider } from '../api/public'
import WS from '../utils/websocket';
import * as types from './action-types'

export default {
    state: {
        sliders: [],
        ws: null, // 全局的websocket
        receiveMsgArr: [], // 服务器发送的消息
    },
    mutations: {
        async [types.SET_SLIDERS](state, payload) {
            state.sliders = payload;
        },
        async [types.INIT_WEBSOCKET](state, ws) {
            state.ws = ws;
        },
        async [types.RECEIVE_MSG](state, receiveMsg) {
            state.receiveMsgArr.push(receiveMsg);
        }
    },
    actions: {
        async [types.SET_SLIDERS]({ commit }) {
            let { data } = await getSlider()
            commit(types.SET_SLIDERS, data)
        },
        async [types.INIT_WEBSOCKET]({ commit }) {
            let ws = new WS()
            ws.create();
            commit(types.INIT_WEBSOCKET, ws)
        }
    },
    modules: {
    }
}