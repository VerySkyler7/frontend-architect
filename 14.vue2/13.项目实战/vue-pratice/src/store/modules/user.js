import * as types from '../action-types'
import * as user from '@/api/user'

export default {
    state: {
        userInfo: '',
        hasPermission: false,
    },
    actions: {
        async [types.USER_LOGIN](data) {
            const result = await user.login(data)
            console.log(result, 000)
        }
    }
}