import Vue from 'vue';
import App from './App.vue'

// 入口改装成了函数 目的是服务端渲染时 每次访问的适合都可以通过这个工厂函数返回一个全新的实例，保证每个人访问都可以拿到一个自己的实例
export default () => {
    const app = new Vue({
        render: h => h(App)
    });
    return { app }
}

// 下面代码单例的问题主要是针对 render.createRenderer().renderToString(vm);这种方式，如果是webpack打包的代码，就无所谓了
// let vue = new Vue({
//     render:h=>h(App) //h => createElement _c
// }).$mount('#app');

// export default () => ( { app: vue } )