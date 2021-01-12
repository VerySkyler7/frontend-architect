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
            this.bindHandler = false;
            this.listener = [];
        }

        add(el, bindings) {
            Vue.nextTick(() => {
                // 1. 绑定滚动事件
                let parent = scrollParent(el)

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