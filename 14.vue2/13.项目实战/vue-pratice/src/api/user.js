import axios from '@/utils/request.js'
import config from './config/user'

export const registry = (data) => {
    return axios.post(config.registry, data)
}