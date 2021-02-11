import store from "../store";
import { getLocal } from "./local";
import * as types from '../store/action-types'

class WS {
    constructor(config = {}) {
        this.port = config.port || 4000;
        this.protocol = config.protocol || 'ws';
        this.url = config.url || 'localhost';
        this.heartbeat = config.heartbeat || 30 * 1000;
        this.ws = null;
    }

    /**
     * WebSocket打开后的事件
     * 
     * 1. 打开后先做一次鉴权操作
     * 2. websocket是基于tcp的，第一次连接靠的是http，但不能修改header
     * 3. 因此通过send方法，发送自定义数据来进行鉴权
     * 4. send方法发送的必须是一个字符串数据
     */
    onOpen = () => {
        this.ws.send(JSON.stringify({
            type: 'auth',
            data: getLocal('token')
        }))
    }

    /**
     * 发送消息
     */
    sendMsg = msg => {
        this.ws.send(JSON.stringify({
            type: 'message',
            data: msg
        }))
    }

    /**
     * WebSocket收到消息后的回调
     * data,type为服务器和客户端双方定义的接口字段
     * 
     * 心跳监测：
     * 1. heartCheck用于监测服务器心跳，每次服务器发来心跳，则返回一条心跳信息给服务器，保持一直连接
     * 2. 通过checkServer中的防抖来判断服websocket是否正常，如果正常则销毁定时器，如果不正常则重新建立连接
     * 3. 服务器每30秒发送一次监测心跳，客户端在收到监测消息后，40秒后如果没收到下一条监测消息则销毁连接重新连接
     */
    onMessage = (e) => {
        const { data, type } = JSON.parse(e.data);
        switch (type) {
            case 'auth': 
                console.log(data);
                break;
            case 'heartCheck':
                this.checkServer();
                this.ws.send(JSON.stringify({type: 'heartCheck'}));
                break;
            case 'message':
                store.commit(types.RECEIVE_MSG, data);
                break;
            default: 
                console.log(data);
        }
    }

    checkServer = () => {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.onClose();
            this.onError();
        }, 40 * 1000);
    }

    /**
     * webSocket关闭时的回调
     */
    onClose = () => {
        this.ws.close();
    }

    /**
     * websocket错误回调 如连接失败
     */
    onError = (err) => {
        // console.error(err)
        this.create();
    }

    create() {
        this.ws = new WebSocket(`${this.protocol}://${this.url}:${this.port}`)
        this.ws.onopen = this.onOpen;
        this.ws.onmessage = this.onMessage
        this.ws.onclose = this.onClose;
        this.ws.onerror = this.onError;
    }

}

export default WS;