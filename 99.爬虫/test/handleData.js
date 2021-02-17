module.exports = (time = 5 * 60 * 1000) => {

    setInterval(startWork, time);

}

function startWork() {
    let fs = require('fs')
    let path = require('path')
    fs.copyFileSync(path.resolve(__dirname, 'info.json'), path.resolve(__dirname, 'list.json'))
    fs.writeFileSync(path.resolve(__dirname, 'list.json'), ']', { flag: 'a' })
    let list = require('./list.json')

    list = list.map(item => {
        if (typeof item.praise === 'string' && item.praise.includes('k')) {
            item.praise = parseFloat(item.praise) * 1000
        }
        if (typeof item.critical === 'string' && item.critical?.includes('k')) {
            item.critical = parseFloat(item.critical) * 1000
        }
        item.percent = (item.praise / item.critical).toFixed(2)
        return item;
    })

    list = list.sort((a, b) => (b.praise - b.critical) - (a.praise - a.critical))

    fs.writeFile(path.resolve(__dirname, 'list.json'), JSON.stringify(list), err => {
        if (err) console.log(err)
    })
    console.log(list.length)
    list = list.filter(item => item.percent > 7 && item.praise > 1000 && item.critical < 100000)

    fs.writeFile(path.resolve(__dirname, 'jingxuan.json'), JSON.stringify(list), err => {
        if (err) console.log(err)
    })
}