import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  // if (process.env.NODE_ENV !== 'production' &&
  //   !(this instanceof Vue)
  // ) {
  //   warn('Vue is a constructor and should be called with the `new` keyword')
  // }
  this._init(options)
}

initMixin(Vue) // _init
stateMixin(Vue) // $set $delete $data $watch
eventsMixin(Vue) // $on $emit $once $off
lifecycleMixin(Vue) // _update => dom diff => render realdom
renderMixin(Vue) // $nextTick _render => vm.options.render() && define _c _v _s ...

export default Vue
