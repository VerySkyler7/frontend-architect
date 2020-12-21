// 自定义需要显示到命令行中的命令
const config = { // 给自己来维护参数的
    'port':{
        option:'-p,--port <n>', // <n> 表示时一个值
        descriptor:'set your server port',
        default: 8080,
        usage:'zf-hs --port <n>'
    },
    'directory':{ // 设置运行环境，默认为执行命令的当前目录
        option:'-d,--directory <n>',
        descriptor:'set your server start directory',
        default: process.cwd(), // 获取当前的工作环境
        usage: 'zf-hs --directory <n>'
    },
    'cache':{
        option:'-c,--cache <n>',
        descriptor:'set your server cache',
        default:'no-cache',
        usage: 'zf-hs --cache <n>'
    }
}
module.exports = config;

console.log(process.cwd());