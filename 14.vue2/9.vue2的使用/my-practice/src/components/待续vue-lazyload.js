// import _ from 'lodash'

const vueLazyload = {
    install(Vue, opt){
        const LazyClass = lazy(Vue);
        let instance = new LazyClass(opt)
        Vue.directive('lazy', {
            bind: instance.add.bind(instance),
            unbind: instance.remove.bind(instance)
        })
    }
}

const scrollParent = (child) => {
    let parent = child.parentNode;
    while(parent) {
        if(/scroll/.test(getComputedStyle(parent)['overflow'])) { 
            return parent;
        }
        parent = parent.parentNode;
    }
}

const lazy = (Vue) => {
    return class {
        constructor(options) {
            this.options = options;
            this.bindHandler = false; // 是否绑定过滚动事件
            this.listener = [];
        }

        add(el, bindings) {
            Vue.nextTick(() => {
                // 1. 绑定滚动事件
                if(!this.bindHandler) { // 如果没绑定过则进行绑定
                    let parent = scrollParent(el) // 寻找可以scroll的父级元素，判断方式：获取元素的style，判断overflow的值是否为scroll
                }
                // 2. 监测el是否需要显示

                // 3. 需要显示则将src设置成img
                console.log(parent);
                console.log(getComputedStyle(el.parentNode.parentNode)['overflow']);
                el.setAttribute("src", bindings.value)
            })
            console.log(Vue , bindings);
            // Vue.nextTick(() => {
            //     let ele = scrollParent(el);
            // })
        }

        remove(){}
    }
}

export default vueLazyload;