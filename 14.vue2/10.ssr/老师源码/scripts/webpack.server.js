const base =require('./webpack.base')
const {merge} = require('webpack-merge');
const  HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = merge(base,{
    target:'node',
    entry: {
        server:path.resolve(__dirname, '../src/server-entry.js')
    },
    output:{
        libraryTarget:"commonjs2" // 将打包后的文件使用module.exports的方式导出。commonjs为exports。commonjs2为module.exports
    },
    plugins:[
        new HtmlWebpackPlugin({ // 会将打包后的bundle.js文件自动插入到html中，同时将模板index.ssr.html打包到dist下，名字为server.html
            template: path.resolve(__dirname, '../public/index.ssr.html'),
            filename:'server.html',
            excludeChunks:['server'], // 排除entry下的server入口文件
            minify:false
            // 默认的名字叫index.html
        }),
    ]
})