import _ from 'lodash'

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

// const scrollParent = ()

const lazy = (Vue) => {
    return class {
        constructor(options) {
            this.options = options;
            this.bindHandler = false;
            this.listener = [];
        }

        add(el, bindings) {
            Vue.nextTick(() => {
                let ele = scrollParent(el);
            })
        }

    }
}

export default vueLazyload;