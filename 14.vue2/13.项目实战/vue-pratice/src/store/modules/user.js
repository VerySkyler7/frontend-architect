import * as types from '../action-types'
import * as user from '@/api/user'
import { setLocal, getLocal, removeLocal } from '@/utils/local'
import router from '../../router'
import per from '../../router/per';

// 对本地的per(全集)进行过滤，通过服务器返回的authList进行过滤
// 同时对children进行递归
const filterRouter = function (authList) {
    if (!authList) return [];
    function filter() {
        return per.filter(item => {
            if (item?.children?.length) {
                item.children = filter(item.children);
            }
            return authList.find(cur => cur.auth === item.meta.auth);
        })
    }
    return filter();
}

export default {
    state: {
        userInfo: {},
        hasPermission: false, // 代表是否登录
        menuPermission: false, // 是否请求过菜单权限
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
        [types.SET_MENU_PERMISSION](state, menuPermission) {
            state.menuPermission = menuPermission
        }
    },
    actions: {
        async [types.SET_USER]({ commit }, { userInfo, has }) {
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
        async [types.USER_LOGOUT]({ dispatch }) {
            dispatch(types.SET_USER, { userInfo: {}, has: false })
        },
        async [types.VALIDATE_TOKEN]({ commit, dispatch }) {
            if (!getLocal('token')) return false;
            try {
                const userInfo = await user.validate();
                if (userInfo.code == 1) {
                    dispatch(types.SET_USER, { userInfo: {}, has: false })
                } else {
                    dispatch(types.SET_USER, { userInfo, has: true })
                    return true;
                }
            } catch (err) {
                dispatch(types.SET_USER, { userInfo: {}, has: false })
            }
            return false;
        },
        async [types.ADD_ROUTE]({ commit, state }) {
            const { authList } = state.userInfo;
            if (authList) {
                let routes = filterRouter(authList);
                // 找到manage路由
                const manageRoute = router.options.routes.find(item => {
                    return item.path === '/manage'
                });
                if(manageRoute) {
                    manageRoute.children = routes; // 设置子路由
                    router.addRoutes([manageRoute]); // 动态添加路由
                }
            }
            commit(types.SET_MENU_PERMISSION, true);
        }
    }
}
