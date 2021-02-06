import store from '../store'
import * as types from '../store/action-types'

const validateToken = async function (to, from, next) {
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

export default {
    validateToken
}