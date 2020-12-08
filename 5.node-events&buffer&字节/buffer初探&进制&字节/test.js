const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
fs.readFile(path.resolve(__dirname, 'a.txt'), function(err, data){ // 第二个参数不写utf-8，则data为buffer
  console.log(iconv.decode((data), 'gbk'));
})