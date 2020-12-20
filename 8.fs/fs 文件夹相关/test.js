const fs = require('fs')
const path = require('path')

// fs.rmdir(path.resolve(__dirname, 'd'), err => console.log(err))
fs.readdir(path.resolve(__dirname, 'd'), (err, paths) => {
    console.log(paths);
})
