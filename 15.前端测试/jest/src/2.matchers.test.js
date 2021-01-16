// matchers的用法
describe("测试matchers", () => {
    // it('判断是否相等',()=>{
    //     expect(1+1).toBe(2); // 相等于 js中的===
    //     expect({name:'zf'}).toEqual({name:'zf'}); // 比较内容是否相等
    //     expect(true).toBeTruthy(); // 是否为 true / false 也可以用toBe(true)
    //     expect(false).toBeFalsy();
    // });
    
    // it('判断不相等关系',()=>{
    //     expect(1+1).not.toBe(3); // not取反
    //     expect(1+1).toBeLessThan(5); // js中的小于
    //     expect(1+1).toBeGreaterThan(1); // js中的大于
    // });
    
    // it('判断是否包含',()=>{
    //     expect('hello world').toContain('hello'); // 是否包含
    //     expect('hello world').toMatch(/hello/); // 正则
    // });

    it('判断是否为null', () => {
        expect(1).not.toBeNull();
        expect(null).toBeNull();
    })
    
})