let test = require('./test.json')
let fs = require('fs')
let path = require('path')

test = test.map(item => {
    if(typeof item.praise === 'string' && item.praise.includes('k')) {
        item.praise = parseFloat(item.praise) * 1000
    }
    if(typeof item.critical === 'string' && item.critical?.includes('k')) {
        item.critical = parseFloat(item.critical) * 1000
    }
    item.percent = (item.praise / item.critical).toFixed(2)
    return item;
})

test = test.sort((a,b) => (b.praise - b.critical) - (a.praise - a.critical) )

fs.writeFile(path.resolve(__dirname, 'test.json'), JSON.stringify(test), err => {
    if(err) console.log(err)
})
console.log(test.length)
test = test.filter(item => item.percent > 7 && item.praise > 1000 && item.critical < 100000)

fs.writeFile(path.resolve(__dirname, 'jingxuan.json'), JSON.stringify(test), err => {
    if(err) console.log(err)
})