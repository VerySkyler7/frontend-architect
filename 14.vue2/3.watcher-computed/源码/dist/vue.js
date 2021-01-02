(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('webpack')) :
    typeof define === 'function' && define.amd ? define(['webpack'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}
    // html字符串 =》 字符串  _c('div',{id:'app',a:1},'hello')

    function genProps(attrs) {
      // [{name:'xxx',value:'xxx'},{name:'xxx',value:'xxx'}]
      let str = '';

      for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];

        if (attr.name === 'style') {
          // color:red;background:blue
          let styleObj = {};
          attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
            styleObj[arguments[1]] = arguments[2];
          });
          attr.value = styleObj;
        }

        str += `${attr.name}:${JSON.stringify(attr.value)},`;
      }

      return `{${str.slice(0, -1)}}`;
    }

    function gen(el) {
      if (el.type == 1) {
        // element = 1 text = 3
        return generate(el);
      } else {
        let text = el.text;

        if (!defaultTagRE.test(text)) {
          return `_v('${text}')`;
        } else {
          // 'hello' + arr + 'world'    hello {{arr}} {{aa}} world
          let tokens = [];
          let match;
          let lastIndex = defaultTagRE.lastIndex = 0; // CSS-LOADER 原理一样

          while (match = defaultTagRE.exec(text)) {
            // 看有没有匹配到
            let index = match.index; // 开始索引

            if (index > lastIndex) {
              tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }

            tokens.push(`_s(${match[1].trim()})`); // JSON.stringify()

            lastIndex = index + match[0].length;
          }

          if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
          }

          return `_v(${tokens.join('+')})`;
        }
      }
    }

    function genChildren(el) {
      let children = el.children; // 获取儿子

      if (children) {
        return children.map(c => gen(c)).join(',');
      }

      return false;
    }

    function generate(el) {
      //  _c('div',{id:'app',a:1},_c('span',{},'world'),_v())
      // 遍历树 将树拼接成字符串
      let children = genChildren(el);
      let code = `_c('${el.tag}',${el.attrs.length ? genProps(el.attrs) : 'undefined'}${children ? `,${children}` : ''})`;
      return code;
    }

    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名 

    const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  用来获取的标签名的 match后的索引为1的

    const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签的 

    const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签的
    //           aa  =   "  xxx "  | '  xxxx '  | xxx

    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'

    const startTagClose = /^\s*(\/?)>/; //     />   <div/>
    // ast (语法层面的描述 js css html) vdom （dom节点）
    // html字符串解析成 对应的脚本来触发 tokens  <div id="app"> {{name}}</div>
    // 将解析后的结果 组装成一个树结构  栈

    function createAstElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        parent: null,
        attrs
      };
    }

    let root = null;
    let stack = [];

    function start(tagName, attributes) {
      let parent = stack[stack.length - 1];
      let element = createAstElement(tagName, attributes);

      if (!root) {
        root = element;
      }

      if (parent) {
        element.parent = parent; // 当放入栈中时 继续父亲是谁

        parent.children.push(element);
      }

      stack.push(element);
    }

    function end(tagName) {
      let last = stack.pop();

      if (last.tag !== tagName) {
        throw new Error('标签有误');
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, "");
      let parent = stack[stack.length - 1];

      if (text) {
        parent.children.push({
          type: 3,
          text
        });
      }
    }

    function parserHTML(html) {
      function advance(len) {
        html = html.substring(len);
      }

      function parseStartTag() {
        const start = html.match(startTagOpen);

        if (start) {
          const match = {
            tagName: start[1],
            attrs: []
          };
          advance(start[0].length);
          let end; // 如果没有遇到标签结尾就不停的解析

          let attr;

          while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
            advance(attr[0].length);
          }

          if (end) {
            advance(end[0].length);
          }

          return match;
        }

        return false; // 不是开始标签
      }

      while (html) {
        // 看要解析的内容是否存在，如果存在就不停的解析
        let textEnd = html.indexOf('<'); // 当前解析的开头  

        if (textEnd == 0) {
          const startTagMatch = parseStartTag(); // 解析开始标签

          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue;
          }

          const endTagMatch = html.match(endTag);

          if (endTagMatch) {
            end(endTagMatch[1]);
            advance(endTagMatch[0].length);
            continue;
          }
        }

        let text; // //  </div>

        if (textEnd > 0) {
          text = html.substring(0, textEnd);
        }

        if (text) {
          chars(text);
          advance(text.length);
        }
      }

      return root;
    } // 看一下用户是否传入了 , 没传入可能传入的是 template, template如果也没有传递
    // 将我们的html =》 词法解析  （开始标签 ， 结束标签，属性，文本）
    // => ast语法树 用来描述html语法的 stack=[]
    // codegen  <div>hello</div>  =>   _c('div',{},'hello')  => 让字符串执行
    // 字符串如果转成代码 eval 好性能 会有作用域问题
    // 模板引擎 new Function + with 来实现

    function compileToFunction(template) {
      let root = parserHTML(template); // 生成代码 

      let code = generate(root);
      let render = new Function(`with(this){return ${code}}`); // code 中会用到数据 数据在vm上

      return render; // render(){
      //     return
      // }
      // html=> ast（只能描述语法 语法不存在的属性无法描述） => render函数 + (with + new Function) => 虚拟dom （增加额外的属性） => 生成真实dom
    }

    let id = 0;

    class Dep {
      // 每个属性我都给他分配一个dep，dep可以来存放watcher， watcher中还要存放这个dep
      constructor() {
        this.id = id++;
        this.subs = []; // 用来存放watcher的
      }

      depend() {
        // Dep.target  dep里要存放这个watcher，watcher要存放dep  多对多的关系
        if (Dep.target) {
          Dep.target.addDep(this);
        }
      }

      addSub(watcher) {
        this.subs.push(watcher);
      }

      notify() {
        this.subs.forEach(watcher => watcher.update());
      }

    }

    Dep.target = null; // 一份

    let stack$1 = [];
    function pushTarget(watcher) {
      debugger;
      Dep.target = watcher;
      stack$1.push(watcher);
      console.log(stack$1);
      console.log(watcher.exprOrFn);
    }
    function popTarget() {
      stack$1.pop();
      Dep.target = stack$1[stack$1.length - 1];
    }

    function isFunction(val) {
      return typeof val === 'function';
    }
    function isObject(val) {
      return typeof val == 'object' && val !== null;
    }
    const callbacks = [];

    function flushCallbacks() {
      callbacks.forEach(cb => cb());
      waiting = false;
    }

    let waiting = false;

    function timer(flushCallbacks) {
      let timerFn = () => {};

      if (Promise) {
        timerFn = () => {
          Promise.resolve().then(flushCallbacks);
        };
      } else if (MutationObserver) {
        let textNode = document.createTextNode(1);
        let observe = new MutationObserver(flushCallbacks);
        observe.observe(textNode, {
          characterData: true
        });

        timerFn = () => {
          textNode.textContent = 3;
        }; // 微任务

      } else if (setImmediate) {
        timerFn = () => {
          setImmediate(flushCallbacks);
        };
      } else {
        timerFn = () => {
          setTimeout(flushCallbacks);
        };
      }

      timerFn();
    } // 微任务是在页面渲染前执行 我取的是内存中的dom，不关心你渲染完毕没有


    function nextTick(cb) {
      callbacks.push(cb); // flushSchedulerQueue / userCallback

      if (!waiting) {
        timer(flushCallbacks); // vue2 中考虑了兼容性问题 vue3 里面不在考虑兼容性问题

        waiting = true;
      }
    }

    let queue = [];
    let has = {}; // 做列表的 列表维护存放了哪些watcher
    // 动画  滚动的频率高，节流 requestFrameAnimation

    function flushSchedulerQueue() {
      for (let i = 0; i < queue.length; i++) {
        queue[i].run(); // vm.name = 123?
      }

      queue = [];
      has = {};
      pending = false;
    }

    let pending = false; // 要等待同步代码执行完毕后 才执行异步逻辑

    function queueWatcher(watcher) {
      // 当前执行栈中代码执行完毕后，会先清空微任务，在清空宏任务， 我希望尽早更新页面
      const id = watcher.id; // name 和 age的id 是同一个

      if (has[id] == null) {
        queue.push(watcher);
        has[id] = true; // 开启一次更新操作  批处理 （防抖）

        if (!pending) {
          nextTick(flushSchedulerQueue);
          pending = true;
        }
      }
    }

    let id$1 = 0;

    class Watcher {
      // vm,updateComponent,()=>{ console.log('更新视图了')},true
      constructor(vm, exprOrFn, cb, options) {
        // exporOfFn
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.user = !!options.user; // 是不是用户watcher

        this.lazy = !!options.lazy;
        this.dirty = options.lazy; // 如果是计算属性，那么默认值lazy:true, dirty:true

        this.cb = cb;
        this.options = options;
        this.id = id$1++; // 默认应该让exprOrFn执行  exprOrFn 方法做了什么是？ render （去vm上了取值）

        if (typeof exprOrFn == 'string') {
          this.getter = function () {
            // 需要将表达式转化成函数
            // 当我数据取值时 ， 会进行依赖收集
            // age.n  vm['age.n']  =》 vm['age']['n']
            let path = exprOrFn.split('.'); // [age,n]

            let obj = vm;

            for (let i = 0; i < path.length; i++) {
              obj = obj[path[i]];
            }

            return obj; // getter方法
          };
        } else {
          this.getter = exprOrFn; // updateComponent
        }

        this.deps = [];
        this.depsId = new Set(); // 第一次的value

        this.value = this.lazy ? undefined : this.get(); // 默认初始化 要取值
      }

      get() {
        // 稍后用户更新 时 可以重新调用getter方法
        // defineProperty.get, 每个属性都可以收集自己的watcher
        // 我希望一个属性可以对应多个watcher，同时一个watcher可以对应多个属性
        pushTarget(this); // Dep.target = watcher

        const value = this.getter.call(this.vm); // render() 方法会去vm上取值 vm._update(vm._render)

        debugger;
        popTarget(); // Dep.target = null; 如果Dep.target有值说明这个变量在模板中使用了

        return value;
      }

      update() {
        // vue中的更新操作是异步的
        // 每次更新时 this
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this); // 多次调用update 我希望先将watcher缓存下来，等一会一起更新
        }
      }

      run() {
        // 后续要有其他功能
        let newValue = this.get();
        let oldValue = this.value;
        this.value = newValue; // 为了保证下一次更新时 上一次的最新值是下一次的老值

        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue);
        }
      }

      addDep(dep) {
        let id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }

      evaluate() {
        this.dirty = false; // 为false表示取过值了

        this.value = this.get(); // 用户的getter执行
      }

      depend() {
        let i = this.deps.length;

        while (i--) {
          this.deps[i].depend(); //lastName,firstName 收集渲染watcher
        }
      }

    } // watcher 和 dep

    function patch(oldVnode, vnode) {
      if (oldVnode.nodeType == 1) {
        // 用vnode  来生成真实dom 替换原本的dom元素
        const parentElm = oldVnode.parentNode; // 找到他的父亲

        let elm = createElm(vnode); //根据虚拟节点 创建元素
        // 在第一次渲染后 是删除掉节点，下次在使用无法获取

        parentElm.insertBefore(elm, oldVnode.nextSibling);
        parentElm.removeChild(oldVnode);
        return elm;
      }
    }

    function createElm(vnode) {
      let {
        tag,
        data,
        children,
        text,
        vm
      } = vnode;

      if (typeof tag === 'string') {
        // 元素
        vnode.el = document.createElement(tag); // 虚拟节点会有一个el属性 对应真实节点

        children.forEach(child => {
          vnode.el.appendChild(createElm(child));
        });
      } else {
        vnode.el = document.createTextNode(text);
      }

      return vnode.el;
    }

    function lifecycleMixin(Vue) {
      Vue.prototype._update = function (vnode) {
        // 既有初始化 又又更新 
        const vm = this;
        vm.$el = patch(vm.$el, vnode);
      };

      Vue.prototype.$nextTick = nextTick;
    } // 后续每个组件渲染的时候都会有一个watcher

    function mountComponent(vm, el) {
      // 更新函数 数据变化后 会再次调用此函数
      let updateComponent = () => {
        // 调用render函数，生成虚拟dom
        vm._update(vm._render()); // 后续更新可以调用updateComponent方法
        // 用虚拟dom 生成真实dom

      }; // 观察者模式： 属性是“被观察者”  刷新页面：“观察者”
      // updateComponent();


      new Watcher(vm, updateComponent, () => {
        console.log('更新视图了');
      }, true); // 他是一个渲染watcher  后续有其他的watcher
    }

    let oldArrayPrototype = Array.prototype;
    let arrayMethods = Object.create(oldArrayPrototype); // arrayMethods.__proto__ = Array.prototype 继承

    let methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
    methods.forEach(method => {
      // 用户调用的如果是以上七个方法 会用我自己重写的，否则用原来的数组方法
      arrayMethods[method] = function (...args) {
        //  args 是参数列表 arr.push(1,2,3)
        oldArrayPrototype[method].call(this, ...args); // arr.push(1,2,3);

        let inserted;
        let ob = this.__ob__; // 根据当前数组获取到observer实例

        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args; // 就是新增的内容

            break;

          case 'splice':
            inserted = args.slice(2);
        } // 如果有新增的内容要进行继续劫持, 我需要观测的数组里的每一项，而不是数组
        // 更新操作.... todo...


        if (inserted) ob.observeArray(inserted); // 数组的observer.dep 属性

        ob.dep.notify(); // arr.push(1,2)
        // arr.splice(0,1,xxxx)
      };
    });

    // 2.如果是数组，会劫持数组的方法，并对数组中不是基本数据类型的进行检测
    // 检测数据变化 类有类型 ， 对象无类型
    // 如果给对象新增一个属性不会触发视图更新  (给对象本身也增加一个dep，dep中存watcher，如果增加一个属性后，我就手动的触发watcher的更新)

    class Observer {
      constructor(data) {
        // 对对象中的所有属性 进行劫持
        this.dep = new Dep(); // 数据可能是数组或者对象

        Object.defineProperty(data, '__ob__', {
          value: this,
          enumerable: false // 不可枚举的

        }); // data.__ob__ = this; // 所有被劫持过的属性都有__ob__ 

        if (Array.isArray(data)) {
          // 我希望数组的变化可以触发视图更新？
          // 数组劫持的逻辑
          // 对数组原来的方法进行改写， 切片编程  高阶函数
          data.__proto__ = arrayMethods; // 如果数组中的数据是对象类型，需要监控对象的变化

          this.observeArray(data);
        } else {
          this.walk(data); //对象劫持的逻辑 
        }
      }

      observeArray(data) {
        // 对我们数组的数组 和 数组中的对象再次劫持 递归了
        // [{a:1},{b:2}]
        // 如果数组里放的是对象类型，也做了观测，JSON.stringify() 也做了收集一来了
        data.forEach(item => observe(item));
      }

      walk(data) {
        // 对象
        Object.keys(data).forEach(key => {
          defineReactive(data, key, data[key]);
        });
      }

    } // vue2 会对对象进行遍历 将每个属性 用defineProperty 重新定义 性能差
    // {arr:[1,2,3]}  


    function dependArray(value) {
      for (let i = 0; i < value.length; i++) {
        let current = value[i]; // current是数组里面的数组 [[[[[]]]]]

        current.__ob__ && current.__ob__.dep.depend();

        if (Array.isArray(current)) {
          dependArray(current);
        }
      }
    }

    function defineReactive(data, key, value) {
      // value有可能是对象
      let childOb = observe(value); // 本身用户默认值是对象套对象 需要递归处理 （性能差）

      let dep = new Dep(); // 每个属性都有一个dep属性
      // 获取到了数组对应ob

      Object.defineProperty(data, key, {
        get() {
          console.log(dep, key); // 取值时我希望将watcher和dep 对应起来

          if (Dep.target) {
            // 此值是在模板中取值的
            dep.depend(); // 让dep记住watcher

            if (childOb) {
              // 可能是数组 可能是对象，对象也要收集依赖，后续写$set方法时需要触发他自己的更新操作
              childOb.dep.depend(); // 就是让数组和对象也记录watcher

              if (Array.isArray(value)) {
                //取外层数组要将数组里面的也进行依赖收集
                dependArray(value);
              }
            }
          }

          return value;
        },

        set(newV) {
          // todo... 更新视图
          if (newV !== value) {
            observe(newV); // 如果用户赋值一个新对象 ，需要将这个对象进行劫持

            value = newV;
            dep.notify(); // 告诉当前的属性存放的watcher执行
          }
        }

      });
    }

    function observe(data) {
      // 如果是对象才观测
      if (!isObject(data)) {
        return;
      }

      if (data.__ob__) {
        return data.__ob__;
      } // 默认最外层的data必须是一个对象


      return new Observer(data);
    }

    function stateMixin(Vue) {
      Vue.prototype.$watch = function (key, handler, options = {}) {
        options.user = true; // 是一个用户自己写的watcher
        // vm,name,用户回调，options.user

        new Watcher(this, key, handler, options);
      };
    }
    function initState(vm) {
      // 状态的初始化
      const opts = vm.$options;

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) {
        initComputed(vm, opts.computed);
      }

      if (opts.watch) {
        // 初始化watch
        initWatch(vm, opts.watch);
      }
    }

    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get() {
          return vm[source][key];
        },

        set(newValue) {
          vm[source][key] = newValue;
        }

      });
    }

    function initData(vm) {
      //
      let data = vm.$options.data; // vm.$el  vue 内部会对属性检测如果是以$开头 不会进行代理
      // vue2中会将data中的所有数据 进行数据劫持 Object.defineProperty
      // 这个时候 vm 和 data没有任何关系, 通过_data 进行关联

      data = vm._data = isFunction(data) ? data.call(vm) : data; // 用户去vm.xxx => vm._data.xxx

      for (let key in data) {
        // vm.name = 'xxx'  vm._data.name = 'xxx'
        proxy(vm, '_data', key);
      }

      observe(data);
    }

    function initWatch(vm, watch) {
      // Object.keys
      for (let key in watch) {
        let handler = watch[key];

        if (Array.isArray(handler)) {
          for (let i = 0; i < handler.length; i++) {
            createWatcher(vm, key, handler[i]);
          }
        } else {
          createWatcher(vm, key, handler);
        }
      }
    }

    function createWatcher(vm, key, handler) {
      return vm.$watch(key, handler);
    }

    function initComputed(vm, computed) {
      const watchers = vm._computedWatchers = {};

      for (let key in computed) {
        // 校验 
        const userDef = computed[key]; // 依赖的属性变化就重新取值 get

        let getter = typeof userDef == 'function' ? userDef : userDef.get; // 每个就算属性本质就是watcher   
        // 将watcher和 属性 做一个映射

        watchers[key] = new Watcher(vm, getter, () => {}, {
          lazy: true
        }); // 默认不执行
        // 将key 定义在vm上

        defineComputed(vm, key, userDef);
      }
    }

    function createComputedGetter(key) {
      return function computedGetter() {
        // 取计算属性的值 走的是这个函数
        // this._computedWatchers 包含着所有的计算属性
        // 通过key 可以拿到对应watcher，这个watcher中包含了getter
        let watcher = this._computedWatchers[key]; // 脏就是 要调用用户的getter  不脏就是不要调用getter

        if (watcher.dirty) {
          // 根据dirty属性 来判断是否需要重新求职
          watcher.evaluate(); // this.get()
        } // 如果当前取完值后 Dep.target还有值  需要继续向上收集


        if (Dep.target) {
          // 计算属性watcher 内部 有两个dep  firstName,lastName
          watcher.depend(); // watcher 里 对应了 多个dep
        }

        return watcher.value;
      };
    }

    function defineComputed(vm, key, userDef) {
      let sharedProperty = {};

      if (typeof userDef == 'function') {
        sharedProperty.get = createComputedGetter(key);
      } else {
        sharedProperty.get = createComputedGetter(key);
        sharedProperty.set = userDef.set;
      }

      Object.defineProperty(vm, key, sharedProperty); // computed就是一个defineProperty
    }

    function initMixin(Vue) {
      // 表示在vue的基础上做一次混合操作
      Vue.prototype._init = function (options) {
        // el,data
        const vm = this; // var that = this;

        vm.$options = options; // 后面会对options进行扩展操作
        // 对数据进行初始化 watch computed props data ...

        initState(vm); // vm.$options.data  数据劫持

        if (vm.$options.el) {
          // 将数据挂载到这个模板上
          vm.$mount(vm.$options.el);
        }
      };

      Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        vm.$el = el; // 把模板转化成 对应的渲染函数 =》 虚拟dom概念 vnode =》 diff算法 更新虚拟dom =》 产生真实节点，更新

        if (!options.render) {
          // 没有render用template，目前没render
          let template = options.template;

          if (!template && el) {
            // 用户也没有传递template 就取el的内容作为模板
            template = el.outerHTML;
            let render = compileToFunction(template);
            options.render = render;
          }
        } // options.render 就是渲染函数
        // 调用render方法 渲染成真实dom 替换掉页面的内容


        mountComponent(vm); // 组件的挂载流程
      };
    }

    function createElement(vm, tag, data = {}, ...children) {
      return vnode(vm, tag, data, data.key, children, undefined);
    }
    function createTextElement(vm, text) {
      return vnode(vm, undefined, undefined, undefined, undefined, text);
    }

    function vnode(vm, tag, data, key, children, text) {
      return {
        vm,
        tag,
        data,
        key,
        children,
        text // .....

      };
    }

    function renderMixin(Vue) {
      Vue.prototype._c = function () {
        // createElement
        return createElement(this, ...arguments);
      };

      Vue.prototype._v = function (text) {
        // createTextElement
        return createTextElement(this, text);
      };

      Vue.prototype._s = function (val) {
        // stringify 
        if (typeof val == 'object') return JSON.stringify(val);
        return val;
      };

      Vue.prototype._render = function () {
        const vm = this;
        let render = vm.$options.render; // 就是我们解析出来的render方法，同时也有可能是用户写的

        let vnode = render.call(vm);
        return vnode;
      };
    }

    function Vue(options) {
      // options 为用户传入的选项
      this._init(options); // 初始化操作， 组件

    } // 扩展原型的


    initMixin(Vue);
    renderMixin(Vue); // _render

    lifecycleMixin(Vue); // _update

    stateMixin(Vue);
    // $mount 找render方法  （template-> render函数  ast => codegen =>字符串）
    // render = with + new Function(codegen) 产生虚拟dom的方法 
    // 虚拟dom -> 真实dom 
    // vm._update(vm._render()); 先生成虚拟dom  -》 生成真实的DOM元素
    // 初次渲染

    return Vue;

})));
//# sourceMappingURL=vue.js.map
