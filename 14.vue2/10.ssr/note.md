# vue ssr本质：
    组件的渲染分new Vue() 首次渲染和 数据响应update渲染
    ssr 就是把new Vue首次渲染的事干了 首次需要挂载到页面上的 转成了字符串
    后续数据响应update渲染还是走vue那一套逻辑  这些逻辑都放到了client.bundle.js里。
    具体实现方式：
    通过webpack将客户端代码和服务端代码分别打包一份，通过服务器运行服务端的代码，将首屏需要渲染的html转成字符串返回浏览器，html字符串中包含了客户端的入口js文件。
1. ssr的原理是通过vue-server-renderer将new Vue生成的页面转成字符串返回给浏览器。同时通过webpack打包对应的js文件，让静态页面和js文件关联起来，一起返回给浏览器。这样可以让服务器代替浏览器完成new Vue的过程，之后的js相关的操作继续交由浏览器完成。
2. 通过vue-server-renderer将vm转成字符串，且对应的页面是静态页面

# ssr router原理：
1. 使用VueRouter正常配置路由，mode为history，这样浏览器改变url时，会访问服务器。
2. 通过服务器router push url改变server端app的路由。
   1. render.renderToString中可以将ctx传递给app入口函数，因此可以拿到请求的url。
   2. push url是一个异步的动作，需要在router.onReady获取router push的结果后，最终将ssr的结果返回给前端。
   
# ssr 404的问题
1. 通过路径是否匹配，返回前端404。也可以通过前端路由配置404的处理。
   1. 通过getMatchedComponents方法获取返回值的长度，如果是0，则reject({ code: 404 })
   2. renderToString可以在回调中获取到reject的结果

https://ssr.vuejs.org/zh/