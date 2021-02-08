import store from '../store'
import * as types from '../store/action-types'

// 校验是否登录或者token是否失效
const loginPermission = async function (to, from, next) {
    const res = await store.dispatch(`user/${types.VALIDATE_TOKEN}`)
    // 匹配当前路由下的每个子路由是否需要登录,如 /a/b 会针对/a 和 /a/b全部匹配出来
    // meta是在router里进行的配置(article配置了meta)
    const needLogin = to.matched.some(item => item.meta.needLogin)

    if (store.state.user.hasPermission) { // 如果登录过
        if (to.path === '/user/login') {
            next('/')
        } else {
            next();
        }
    } else { // 如果没登录
        // 1. 需要登录
        if (needLogin) {
            next('/user/login')
        } else { // 2. 不需要登录
            next();
        }

    }

    // next(); // 继续向后执行，否则会白屏
}

// 根据用户权限设置菜单
const menuPermission = async function (to, from, next) {
    if(!store.state.user.menuPermission 
        && store.state.user.hasPermission) {
        // 根据权限动态添加路由
        store.dispatch(`user/${types.ADD_ROUTE}`);
        next({...to, replace: true}); // 此处写法属于hack写法，用于解决404的问题。由于组件使用了动态加载，所以需要使用这种方法加载两次。
    } else {
        next();
    }
}

export default {
    // 是否登录
    loginPermission,
    menuPermission,
}