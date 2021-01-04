import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input:'./src/index.js',
    output:{
        format:'umd', // 支持amd 和 commonjs规范 window.Vue
        name:'Vue',
        file:'dist/vue.js',
        sourcemap:true, // es5 -> es6源代码
    },
    plugins:[
        babel({ // 使用babel进行转化 但是拍出node_modules 文件
            exclude:'node_modules/**', // glob 语法
        }),
        process.env.ENV === 'development' ? serve({ // 静态服务器的配置
            open: true, // 启动后是否自动打开浏览器
            openPage: '/index.html', // 自动打开的页面
            port: 3000, // 占用的端口号
            contentBase: '', // 指定静态服务的根路径，'' 代表当前项目即为根目录。如果指定了其他目录，项目中要做什么配置？？
        }) : null
    ]
}


// 后续 需要打包不同的类型 可以写个列表，循环打包