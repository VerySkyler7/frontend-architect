## 第三方模块 （全局的和本地的）
- 全局 就是安装的时候 带有-g的

## npm 打包流程
- 因为npm被放到了全局下 ，所有npm目录下的命令都可以直接执行
- 自己编写全局包 
1. 在package.json中声明bin 命令
2. 需要给对应文件增加 #! 指定环境
3. npm link 可以做链接 将本地代码先暂时的连接到全局下
4. 我需要切换到官方npm下  nrm use npm
5. 登录账号 npm addUser
6. npm publish 发布 并更新（需要改版本号）
7. npm install 
8. 如果升级包 需要更新版本 （版本号）
9. 24小时之内不能重新发布

## npm rollup 打包详细教程
0. https://juejin.cn/post/6844904058394771470