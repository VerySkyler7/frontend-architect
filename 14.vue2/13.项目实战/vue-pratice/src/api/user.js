import axios from '@/utils/request.js'
import config from './config/user'

export const registry = (data) => axios.post(config.registry, data)

export const login = (data) => axios.post(config.login, data)