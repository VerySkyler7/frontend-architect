import axios from '@/utils/request.js'
import config from './config/user'
import { getLocal } from '@/utils/local'

export const registry = (data) => axios.post(config.registry, data)

export const login = (data) => axios.post(config.login, data)

export const validate = () => axios.post(config.validate)