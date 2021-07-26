const puppeteer = require('puppeteer');
const { captureCoin } = require('./captured');

// 存放所有数据
const superData = {
    currentTotal: 0, // 当前总资产
    binance: [],
    huoBi: [],
    temp: [
        // {name: 'bscx', sort: 10, count: 200, costPrice: 18.5, price:  14.76}
    ]
};

// 定时爬取币安网数据
(async () => {
    const browser = await puppeteer.launch({ headless: true })

    const page = await browser.newPage()
    await page.goto('https://cn.investing.com/crypto/currencies', { timeout: 9999999 })
    page.on('console', msg => {
        if (msg._type === 'info') superData.binance = JSON.parse(msg._text)
    })
    await page.evaluate(() => {
        const targetArr = [
            { name: 'BNB', sort: 3, count: 0, costPrice: 50 },
            { name: 'CAKE', sort: 4, count: 5000, costPrice: 12.1 },
        ];
        setInterval(() => {
            const res = targetArr.reduce((prev, item) => {
                const nameElm = document.querySelector(`td[title=${item.name}]`);
                if (!nameElm) {
                    prev.push(item)
                    return prev;
                };
                const price = nameElm.nextElementSibling.innerText;
                const rise = nameElm.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
                prev.push({ ...item, price, rise })
                return prev
            }, []);
            console.info(JSON.stringify(res))
        }, 1000);
    });

})();

// 定时爬取火币网数据
(async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage();
    await page.goto('https://www.huobi.com/en-us/markets/', { timeout: 9999999 });

    page.on('console', msg => {
        if (msg._type === 'info') superData.huoBi = JSON.parse(msg._text)
    })

    await page.evaluate(() => {
        const targetArr = [
            { name: 'dot', sort: 1, count: 2450, costPrice: 4 },
            { name: 'ksm', sort: 2, count: 0, costPrice: 103 },
            { name: 'btc', sort: 7, count: 0, costPrice: 0 },
            { name: 'eth', sort: 6, count: 0, costPrice: 1840 },
            { name: 'doge', sort: 11, count: 0, costPrice: 0 },
            { name: 'matic', sort: 11, count: 0, costPrice: 0 },
            { name: 'uni', sort: 11, count: 0, costPrice: 0 },
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


// 定时计算爬取后的数据
(() => {
    setInterval(() => {
        let arr = superData.huoBi.concat(superData.binance).concat(superData.temp);
        if (arr.length > 8) {
            arr = arr.sort((a, b) => a.sort - b.sort)
        }

        const res = arr.reduce((prev, item) => {
            // getKsm2DotRatio(item.name, item.price); // 获取ksm和dot的比例
            prev.total += item.price * item.count;
            prev.price += item.name.toLocaleLowerCase()
                + '  price：' + item.price
                + '  costPrice：' + item.costPrice
                + '  rise：' + item.rise
                + '  total：' + Number(Number(item.price) * item.count * 6.54).toFixed(2)
                + '  count：' + item.count + '<br>\r\n';
            // + '  profit：' + Number(item.count * (item.price - item.costPrice) * 6.54).toFixed(2) + '<br>\r\n'
            captureCoin(item);
            return prev
        }, { total: 0, price: '' });

        if (res.total) {
            res.total = Number(res.total * 6.54).toFixed(2);
            if (Math.abs(res.total - superData.currentTotal) > 20000) { // 当波动大于1万时 发一个邮件
                superData.currentTotal = res.total;
                // sendMail(res.total, res.price + 'total：' + res.total)
            }
            console.log(res.price + 'total：' + res.total)
        }
    }, 1000);
})();
