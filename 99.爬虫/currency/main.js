const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');


// 存放所有数据
const superData = {
    currentTotal: 0, // 当前总资产
    binance: [],
    huoBi: []
};

let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'wangxpengx@163.com', // generated ethereal user
        pass: 'ONRXIIYHFIVOWVNW' // generated ethereal password
    }
});

(async () => {
    const browser = await puppeteer.launch({ headless: true })
    
    const page = await browser.newPage()
    await page.goto('https://cn.investing.com/crypto/currencies', { timeout: 9999999 })
    page.on('console', msg => {
        if (msg._type === 'info') superData.binance = JSON.parse(msg._text)
    })
    await page.evaluate(() => {
        const targetArr = [
            {name: 'BNB', sort: 3, count: 31.4, costPrice: 50},  
            {name: 'XVS', sort: 4.5, count: 32.9, costPrice: 87},  
            {name: 'CAKE', sort: 6, count: 35, costPrice: 11.4}
        ];
        setInterval(() => {
            const res = targetArr.reduce((prev, item) => {
                const nameElm = document.querySelector(`td[title=${item.name}]`);
                if (!nameElm) return prev;

                const price = nameElm.nextElementSibling.innerText;
                const rise = nameElm.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
                prev.push({ ...item, price, rise })
                return prev
            }, []);
            console.info(JSON.stringify(res))
        }, 1000);
    });

})();

(async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage();
    await page.goto('https://www.huobi.com/zh-cn/markets/', { timeout: 9999999 });
    
    page.on('console', msg => {
        if (msg._type === 'info')  superData.huoBi = JSON.parse(msg._text)
    })

    await page.evaluate(() => {
        const targetArr = [
            {name: 'badger', sort: 4.5, count: 28, costPrice: 57}, 
            {name: 'dot', sort: 1, count: 2427, costPrice: 4}, 
            {name: 'ksm', sort: 2, count: 160.75, costPrice: 103}, // 214 * 7
            {name: 'mdx', sort: 4, count: 1421, costPrice: 3}, 
            {name: 'xem', sort: 5, count: 1647, costPrice: 0.55},
            {name: 'btc', sort: 7, count: 0, costPrice: 0}, 
            {name: 'eth', sort: 8, count: 0, costPrice: 0}, 
        ];
        setInterval(() => {
            const res = targetArr.reduce((prev, item) => {
                const firstElm = document.querySelector(`#${item.name}usdt`).firstElementChild.firstElementChild;
                if (!firstElm) return prev;
                const price = firstElm.nextElementSibling.innerText.split("≈")[0].trim();
                const rise = firstElm.nextElementSibling.nextElementSibling.innerText;
                prev.push({ ...item, price, rise })
                return prev
            }, []);
            console.info(JSON.stringify(res))
        }, 1000);
    });

})();

; (() => {
    setInterval(() => {
        let arr = superData.huoBi.concat(superData.binance);
        if(arr.length > 8) {
            arr = arr.sort((a, b) => a.sort - b.sort)
        }

        let total = 0;
        const res = arr.reduce((prev, item) => {

            console.log(`${item.name.toLocaleLowerCase()}  利润：${Number(item.count * (item.price - item.costPrice) * 6.4).toFixed(2)}`)

            total += item.price * item.count;
            return prev + item.name.toLocaleLowerCase() + ':' + item.price + ':' + item.rise + ':' + Number(Number(item.price) * item.count * 6.4).toFixed(2) + '  '
        }, '');
        if(res) {
            total = Number(total * 6.4).toFixed(2);
            if(total - superData.currentTotal > 5000) { // 当波动大于1万时 发一个邮件
                superData.currentTotal = total;
                sendMail('total:' + total + ' ' + res)
            }
            console.log('total:' + total + ' ' + res)
        }
    }, 1000);
})();


function sendMail(msg) {
    let mailOptions = {
        from: 'wangxpengx@163.com', // sender address
        to: '379522872@qq.com', // list of receivers
        subject: 'coin', // Subject line
        html: msg // html body
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    });
}
