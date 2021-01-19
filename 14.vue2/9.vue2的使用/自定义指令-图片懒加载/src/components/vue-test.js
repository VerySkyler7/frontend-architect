export default {
    install(Vue, options){
        Vue.mixin({
            beforeCreate() {
                console.log(options, '测试插件是否能单独挂载组件', this.$options._componentTag)
            }
        })
    }
}