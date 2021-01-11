# 目录介绍
1. .circleci 持续继承
   1. 持续部署。后面还会讲。
2. .github 与github网页相关的配置。
3. benchmarks 用于做框架的性能测试。
4. dist 输出目录
   1. 用于存储打包出来的结果。
5. examples 存放一些案例
6. flow 类型声明文件
   1. 类似typescirpt。面向源码内部的类型声明。
   2. flow属于早期的类型语言，现在已经很少有人用了。
   3. 学习vue源码，需要在vscode安装flow插件，这样vscode就不会报错了。
7. packages vue中自己写的包
   1. server-renderer 用于服务端渲染 后面会讲
   2. template-compiler 用于模板编译，将模板编译成render函数
   3. weex-template-compiler weex-vue-framework weex相关的 非重点
8. scripts 用于做项目工程化构建的
   1. 存放了rollup的相关配置
9. src 存放框架相关的业务代码
10. test 用于存放测试代码
   1. e2e测试
   2. unit单元测试 可以测试源码中的一些工具方法具体的含义。
11. types typescript 声明文件
    1. 用于面向用户的代码提示
12. .editorconfig 编辑器的风格
13. LICENSE 执照、许可 描述了版权相关的说明

# 寻找源码入口文件
0. 具体可参见入口关系图(箭头反过来为调用关系)
1. 通常代码的入口在src的index下。
2. 入口分析：(关键点：到package.json下寻找build 命令)
   1. 对于第三方包，运行时通常找package.json下的main或module自动运行。
      1. commonJS下一般找main属性对应的路径。
      2. webpack环境下通常找module对应的路径。
      3. 但main和module通常对应的是打包后的路径，而非真正的源码。
   2. (重点)写完框架代码，通常需要打包，将es6语法转成es5语法，所以要从build命令入手寻找源码入口。
   3. 找到打包文件 scripts/build.js 
      1. 分析打包vue时，是以哪个文件作为入口的：
      2. 获取打包配置文件，通常打包都需要有相应的配置文件。
      ``` js
         // config.js 中是对rollup的config做了二次封装，最终导出rollup的配置
         let builds = require('./config').getAllBuilds();

         // config中builds的一些差异
            // 1. web代表web平台，weex平台使用weex开头。
            // 2. runtime代表运行时，不包含编译代码。full代表runtime+complier。
            //    如果只有runtime则代码中不能使用template语法。使用了full，代码的运行效率会降低，因为运行代码时包含了编译的逻辑。
            //    在.vue文件中之所以可以使用<template>语法，是因为webpack中使用了vue-loader对.vue文件进行了编译。
            // 3. format代表打包后的代码所遵循的规范。
            //    1. cjs代表commonJS，用于node环境下使用。
            //    2. es代表es module, 代表es6规范。
            //    3. umd代表amd和cmd规范的集合体，可用于浏览器环境。通常会将commonJS和es module的语法转成umd，这样可以用于任何环境。
      ```
      1. 通过config.js => builds中的key + format得知 web-runtime-esm 为web端运行时代码入口，web-full-esm 为web端运行 + 支持编译的代码入口。
         1. 入口分别为 src/platforms/entry-runtime.js src/platforms/entry-runtime-with-compiler.js


#### src的目录介绍
1. compiler： 模板编译 生成render代码
2. core： 存放核心代码
   1. components： 存放keep-alive
   2. golbal-api： 定义挂载到Vue上的一些方法，如mixin component extend等
   3. instance： 存放组件实例化的入口文件及实例化需要用到的一些初始化方法，如初始化原型上的一些方法：_init、$mount、_c、_update、$watch、initState、initComputed、initWatch。
   4. observer：用于对data进行依赖收集。
   5. util：存放nextTick、mergeOptions等方法。
   6. vdom：存放虚拟dom diff、操作真实dom的相关代码
3. platforms： 针对不同平台做不同的打包处理？
4. server：服务器渲染相关代码(后面会讲)
5. sfc：做模板解析，对.vue文件进行解析
6. shared：存放各个平台需要用到的一些常量或方法。
   
#### 入口分析 entry-runtime.js entry-runtime-with-compiler
1. 他们都引入了`./runtime/index.`文件
2. entry-runtime-with-compiler.js 对Vue.prototype.$mount进行劫持，增加了模板编译的相关代码。
3. runtime/index.js
   1. runtime的作用是在Vue上定义一些方面，方便后面调用，同时针对不同平台做了抹平操作。
   2. Vue原型上定义了$mount(用于组件的挂载)、\__patch__(用于dom diff及渲染元素的)
   3. 执行extend，将不同平台下的directive(指令)、components合并到Vue.options上面。
   4. 引入core/index.js `import Vue from 'core/index'`
4. core/index.js
   1. 核心干了一件事：调用了initGlobalApi，用于初始化Vue上面的一些方法，如mixin、component、extend等。
   2. 感悟：这就是拆分Vue的好处，不是把Vue上面的所有方法都定义到一个文件或方法里，可以在有需要的时候才进行方法的定义，另外把Vue进行导出导入，实现了高内聚低耦合的效果。
   3. 引入了Vue `import Vue from './instance/index'`，至此才定位到了真正的业务入口。

#### 真正的核心入口 src/core/instance/index
1. 定义了Vue构造函数，初始化原型上的一些方法
   ``` js
   initMixin(Vue) // _init
   stateMixin(Vue) // $set $delete $data $watch
   eventsMixin(Vue) // $on $emit $once $off
   lifecycleMixin(Vue) // _update => dom diff => render realdom
   renderMixin(Vue) // $nextTick _render => vm.options.render() && define _c _v _s ...
   ```

# src/core/index initGlobalApi
1. set get 
2. 



# 周日笔记