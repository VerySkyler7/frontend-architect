import config from './config/public'
import axios from '@/utils/request'

// 获取轮播图功能 
export const getSlider = () => {
    return axios.get(config.getSlider)
}