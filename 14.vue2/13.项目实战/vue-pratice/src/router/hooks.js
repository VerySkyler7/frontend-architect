import store from '../store'
import * as types from '../store/action-types'

const validateToken = function (to, from, next) {
    store.dispatch(`user/${types.VALIDATE_TOKEN}`)
    next(); // 继续向后执行，否则会白屏
}

export default {
    validateToken
}