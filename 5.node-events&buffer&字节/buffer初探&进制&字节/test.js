// // 转成用16进制标识的三个字节
// console.log(Buffer.from('珠'))  // <Buffer e7 8f a0>

// // 将16进制转成二进制
// console.log((0xe7).toString(2)); // 11100111
// console.log((0x8f).toString(2)); // 10001111
// console.log((0xa0).toString(2)); // 10100000

// // 将转换后的二进制重新组合 按6位进行拆分
// // 111001 111000 111110 100000

// // 将每一组二进制数补成一个字节
// // 00111001 00111000 00111110 00100000

// // 将二进制转成十进制
// console.log(parseInt('00111001', 2)); // 57
// console.log(parseInt('00111000', 2)); // 56 
// console.log(parseInt('00111110', 2)); // 62
// console.log(parseInt('00100000', 2)); // 32

// 64位字符
let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' // 26个
str += str.toLowerCase()
str += '0123456789+/'

console.log(str[57] + str[56] + str[62] + str[32]);