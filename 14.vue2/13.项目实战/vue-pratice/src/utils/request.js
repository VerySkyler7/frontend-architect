import config from '@/config/config.js'
import axios from 'axios'
import { getLocal } from './local';

class Request {

    baseURL = config.baseURL;
    timeout = 3000;

    request(options) {
        const instance = axios.create();
        this.setInterceptors(instance);
        const opts = this.mergeOptions(options);
        return instance(opts).then(val => {
            return val
        });
    }

    mergeOptions(options) {
        return {
            ...this,
            ...options
        }
    }

    setInterceptors(instance) {
        // request中的回调函数存放的是config
        instance.interceptors.request.use((config) => {
            // 一般增加一些token判断逻辑
            config.headers.authorization = 'Bearer ' + getLocal('token');
            return config;
        })

        // response中的回调存放的是res
        instance.interceptors.response.use(res => {
            // 这里的status是后端自己封装的吗？
            if(res.status == 200) {
                if(res.data.code == 1) {
                    return Promise.reject(res.data)
                } else {
                    return Promise.resolve(res.data)
                }
            } else {
                // 如果有错误，会在data里存放一个data字段用于存放错误信息
                return Promise.reject(res.data.data)
            }
        }, err => {
            switch(err.response.status) {
                case '401': 
                    console.error(err)
                    break;
                default:
                    break;
            }
            return Promise.reject(err)
        })
    }

    // get第三个需要是一个个参数
    get(url, config){
        return this.request({
            url,
            method: 'get',
            ...config
        })
    }
    
    // post第三个需要是data
    post(url, data) {
        return this.request({
            url,
            method: 'post',
            data
        })
    }
}

export default new Request();