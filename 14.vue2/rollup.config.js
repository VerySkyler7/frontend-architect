// 与webpack不同的是可以在config中直接使用es6语法
// 此文件用于打包的配置

// 待测试contentBase的用法

import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js', // 打包的入口文件
    output: {
        file: 'dist/umd/vue.js', // 出口路径
        name: 'Vue', // 指定打包后全局变量的名字
        format: 'umd', // 打包后的代码使用的模块规范 ？？使用umd是因为它的兼容性更好吗
        sourcemap: true, // 是否开启源码调试，可以找到源码的报错位置 ？？线上代码出错后也能定位到源码位置？？是否会有安全问题
    },
    plugins: [
        babel({
            exclude: "node_modules/**", // 不对node_modules下的任何文件进行转义
        }),
        process.env.ENV  === 'development' ? serve({ // 静态服务器的配置
            open: true, // 启动后是否自动打开浏览器
            openPage: '/public/index.html', // 自动打开的页面
            port: 3000, // 占用的端口号
            contentBase: '', // 指定静态服务的根路径，'' 代表当前项目即为根目录。如果指定了其他目录，项目中要做什么配置？？
        }) : null
    ]
}

