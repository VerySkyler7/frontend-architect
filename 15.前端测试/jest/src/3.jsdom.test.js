const removeNode = (node) => {
    node.parentNode.removeChild(node)
};

it('测试删除节点',()=>{
    document.body.innerHTML = `<div><button data-btn="btn"></button</div>`
    let btn = document.querySelector('[data-btn="btn"]')
    expect(btn).not.toBeNull()
    removeNode(btn);
    btn = document.querySelector('[data-btn="btn"]');
    expect(btn).toBeNull()
})