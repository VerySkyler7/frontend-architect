const target = Buffer.alloc(2)

const src = Buffer.from('我')

src.copy(target)

console.log(target);
console.log(src);