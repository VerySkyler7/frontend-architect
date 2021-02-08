# 查看脚手架版本的差别
https://github.com/vuejs/vue-cli/blob/dev/CHANGELOG.md

# cli3如何升级到cli4
https://cli.vuejs.org/migrating-from-v3/

# 如何升级cli
执行安装命令即可直接升级
``` js
npm install -g @vue/cli
``` 

# 新建项目
1. 命令行执行vue ui，会在浏览器打开一个创建页面
``` js
vue ui
```
2. 将本机存放项目的path copy到path栏中 => 回车 => 在此创建项目

# 登录及token验证的实现思路
- 登录状态持久化
1. 登录后将token存储到localstorage中(防止刷新时丢失，另外token不需要驱动视图的变化)，将用户信息存储到vuex的store中，这样方便共享用户的信息。
- 校验是否登录 
1. 每次请求接口时，通过拦截器在headers中添加token标识，如果token失效，会直接返回token失效的标识。
2. 路由跳转时，在router.beforeEach中请求服务器，验证localStorage中的token是否失效，如果有效则返回用户的信息，这样方便获取到最新的用户信息。
3. 刷新页面时，利用第二步的逻辑即可完成登录状态的持久化。
- 路由钩子校验用户登录状态
0. 核心是通过to.matched对当前路由进行some判断，如果有一个需要needLogin则代表当前路由需要登录。
1. 其中needLogin需要在router的meta中进行配置，这样在router.beforeEach中即可拿到meta。
2. 具体可以查看router/hook.js中的逻辑。

# 动态添加路由
- 在路由钩子中调用action
- action中根据用户的权限过滤出子路由
- 通过parentRoute.children = childrenRoutes 添加子路由
- 通过router.addRoutes(parentRoute)动态添加路由
- 通过next({ ...to, replace: true }) 处理import()动态路由404的问题

# 递归菜单 核心：
- 将服务器的树形数据(是一个通过pid关联的数组)，转换成前端的children树形数据
- 遍历服务器数据时，利用map扁平化记录每个item，方便给children添加时快速找到它的pid
- 利用jsx递归的方式对children进行递归渲染menu-item

