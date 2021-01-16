## Jest 
- facebook出的 基于jsdom。用js对象模拟浏览器环境。优势：不需要集成断言(chai) mock数据(sinon) 等第三方库，属于0配置。缺陷：不能测试样式相关的。
- 适合测一些类库。

## karma
- 可以把测试泡在真正的浏览器上，可以测试ui组件库

## mocha
- 提供了一个测试环境，可以集成断言、mock数据等第三方库进行测试。

## e2e
- 是指端到端的测试，属于黑盒、集成测试，用过编写测试用例，自动化模拟用户操作，确保组件之间正常通信，数据正常流转。
- e2e一般用户大型项目中，现在用的已经比较少了。

## 测试分类
- BDD 行为驱动开发，先定好功能再开发。
- TDD 测试驱动开发，先写好测试代码再开发。

----------------------------------------分割线----------------------------------------

## Jest的使用
1. 安装jest npm包
   ```
   npm i jest -D
   ```
2. 安装@babel/preset-env
   1. 由于jest默认只支持node语法，所以用到es module语法时需要通过babel进行转义
   2. jest中默认带了babel-jest，所以只需要安装@babel/preset-env。
   ``` js
   npm i @babel/preset-env -D
   // preset-env的作用：它是bebel的一个插件，将高级语法转成低级语法。
   ```
   3. 构建.babelrc
   ``` js
    {
        "presets": [ // presets是插件的集合
            ["@babel/preset-env", { // 对@babel/preset-env进行配置
                "targets": {"node": "current"} // 将项目中的文件转换成node当前版本的语法
            }]
        ]
    }
   ```
   4. 代码编写参加jest/src
3. npx jest
   扫描项目中.test.js结尾的文件开始运行

4. 实时监测
   ``` js
   "scripts": {
        "test": "jest --watchAll"
    }
   ```

