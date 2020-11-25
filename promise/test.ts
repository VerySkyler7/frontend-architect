export default (() => {
    const p = new Promise((resolve, reject) => {
        resolve(Promise.reject(2))
    })
    
    p.then((res)=>{
        console.log(res, '******');
    }, (err) => {
        console.log(err, '------');
    })
})()
