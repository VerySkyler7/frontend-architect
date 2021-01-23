import config from '@/config/config.js'
import axios from 'axios'

class Request {

    constructor() {
        this.baseURL = config.baseURL;
        this.timeout = 3000;
    }

    request(options) {
        const instance = axios.create();
        this.setInterceptors(instance);
        const opts = this.mergeOptions(options);
        instance(opts);
    }

    mergeOptions(options) {
        return {
            ...this,
            options
        }
    }

    setInterceptors(instance) {
        // request中的回调函数存放的是config
        instance.interceptor.request.use((config) => {
            // 一般增加一些token判断逻辑
            return config;
        })

        // response中的回调存放的是res
        instance.interceptor.response.use(res => {
            // 这里的status是后端自己封装的吗？
            if(res.status == 200) {
                // 这里为什么要用Promise.resolve包装一下？
                return Promise.resolve(res.data)
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
        this.request({
            url,
            method: 'get',
            ...config
        })
    }
    
    // post第三个需要是data
    post(url, data) {
        this.request({
            url,
            method: 'post',
            data
        })
    }
}

export default new Request();