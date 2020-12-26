
const Application = require('./application')
const Router = require('./router');
// 创建 应用和 应用的本身做分割
// 封装
function createApplication() {

    return new Application();
}

createApplication.Router = Router
module.exports = createApplication