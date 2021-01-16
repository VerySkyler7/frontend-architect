import { add, subtraction } from './1.入门.js'

// 在jest目录下，运行npx jest可执行.test.js文件
describe("测试parse", () => { // describe 相当于是单元测试，对测试进行分类
    it('测试 add是否正常', () => { // it代表单元测试中的分类，也可以不写describe直接it
        expect(add(1)).toEqual(2);
    })

    it('测试 subtraction是否征程', () => {
        expect(subtraction(2)).toEqual(1);
    })
})