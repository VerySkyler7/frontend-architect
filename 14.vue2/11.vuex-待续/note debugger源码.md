# 直接根据github源码提示
1. 下载源码
2. 执行npm run dev
   1. 可以在script后面增加 --sourcemap 可对应到编译前的源码位置
3. 在dist下创建index.html 引入./vue.js文件
4. 在index.html增加debugger
5. 直接浏览器打开index.html即可进入debugger

# 通过项目查看源码
1. 在项目根目录运行 vue inspect >1.js 将webpack配置文件抽取出来
2. 通过resolve(webpack解析路径) >> alias >> vue$找到对应的入口文件
3. 在入口文件里查找相应的源码进行debugger(需要对源码有一定的了解)