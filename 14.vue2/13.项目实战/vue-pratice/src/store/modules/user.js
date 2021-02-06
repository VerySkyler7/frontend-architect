import * as types from '../action-types'
import * as user from '@/api/user'
import { setLocal, getLocal, removeLocal } from '@/utils/local'

export default {
    state: {
        userInfo: '',
        hasPermission: false,
    },
    mutations: {
        [types.SET_USER](state, userInfo) {
            state.userInfo = userInfo;
            if (userInfo?.token) {
                setLocal('token', userInfo.token)
            } else {
                removeLocal('token')
            }
        },
        [types.SET_PERMISSION](state, has) {
            state.hasPermission = has;
        },
    },
    actions: {
        async [types.SET_USER]({ commit }, { userInfo, has }) {
            debugger
            commit(types.SET_USER, userInfo)
            commit(types.SET_PERMISSION, has)
        },
        async [types.USER_LOGIN]({ commit, dispatch }, payload) {
            try {
                const userInfo = await user.login(payload)
                dispatch(types.SET_USER, { userInfo, has: true })
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async [types.VALIDATE_TOKEN]({ commit }) {
            if (!getLocal('token')) return false;
            try {
                const userInfo = await user.validate();
                if (userInfo.code == 1) {
                    dispatch(types.SET_USER, { userInfo: {}, has: false })
                } else {
                    dispatch(types.SET_USER, { userInfo, has: true })
                }
            } catch (err) {
                dispatch(types.SET_USER, { userInfo: {}, has: false })
            }
        },
        async [types.USER_LOGOUT]({ dispatch }) {
            debugger
            dispatch(types.SET_USER, { userInfo: {}, has: false })
        }
    }
}
