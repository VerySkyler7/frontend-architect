const puppeteer = require('puppeteer');
const { captureCoin } = require('./captured');

// 存放所有数据
const superData = {
    currentTotal: 0, // 当前总资产
    binance: [],
    huoBi: [],
    coinmarket: [],
    feixiaohao: [],
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

});

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

});

// 定时爬取coinmarketcap
(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage();
    await page.goto('https://coinmarketcap.com/', { timeout: 9999999 });

    page.on('console', msg => {
        if (msg._type === 'info') superData.coinmarket = JSON.parse(msg._text)
    })

    await page.evaluate(() => {
        const targetArr = [
            { name: 'btc', fullName: 'bitcoin', sort: 0, count: 0, costPrice: 0 },
            { name: 'cake', fullName: 'pancakeswap', sort: 1, count: 5000, costPrice: 12.1 },
            { name: 'dot', fullName: 'polkadot-new', sort: 2, count: 2450, costPrice: 4 },
            { name: 'bnb', fullName: 'binance-coin', sort: 3, count: 0, costPrice: 50 },
            { name: 'matic', fullName: 'polygon', sort: 4, count: 0, costPrice: 0 },
            { name: 'ksm', fullName: 'kusama', sort: 5, count: 0, costPrice: 103 },
            { name: 'eth', fullName: 'ethereum', sort: 6, count: 0, costPrice: 1840 },
            { name: 'doge', fullName: 'dogecoin', sort: 7, count: 0, costPrice: 0 },
            { name: 'uni', fullName: 'uniswap', sort: 8, count: 0, costPrice: 0 },
        ];
        setInterval(() => {
            const res = targetArr.reduce((prev, item) => {
                let price = "";
                let rise = "";
                const elem = document.querySelector(`a[href="/currencies/${item.fullName}/"]`);
                if(!elem) return prev;
                const firstParent = elem.parentElement;
                firstParent.tagName.toUpperCase() == 'TD' ? 
                    price = elem.parentElement.nextSibling.firstChild.innerText.match(/[\d|,|\.]+/g)[0] : 
                    price = elem.parentElement.parentElement.nextSibling.firstChild.firstElementChild.innerText.match(/[\d|,|\.]+/g)[0];
                firstParent.tagName.toUpperCase() == 'TD' ? 
                    rise = elem.parentElement.nextSibling.nextSibling.firstChild.innerText :
                    rise = elem.parentElement.parentElement.nextSibling.nextSibling.firstChild.innerText;
                price = price.replaceAll(",", "");
                prev.push({ ...item, price, rise });
                console.debug(item.name, price)
                return prev
            }, []);
            console.info(JSON.stringify(res))
        }, 1000);
    });

});

// 定时爬取非小号数据
(async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage();
    await page.goto('https://www.feixiaohao.com/', { timeout: 9999999 });

    page.on('console', msg => {
        if (msg._type === 'info') superData.feixiaohao = JSON.parse(msg._text)
    })

    await page.evaluate(() => {
        /** 切换成美元 */
        document.querySelectorAll('.ivu-dropdown-menu')[2].firstElementChild.nextElementSibling.click();

        const targetArr = [
            { name: 'btc', fullName: 'bitcoin', sort: 0, count: 0, costPrice: 0 },
            { name: 'cake', fullName: 'pancakeswap', sort: 1, count: 5000, costPrice: 12.1 },
            { name: 'dot', fullName: 'polkadot100', sort: 2, count: 2450, costPrice: 4 },
            { name: 'bnb', fullName: 'binance-coin', sort: 3, count: 0, costPrice: 50 },
            { name: 'matic', fullName: 'polygon', sort: 4, count: 0, costPrice: 0 },
            { name: 'ksm', fullName: 'kusama', sort: 5, count: 0, costPrice: 103 },
            { name: 'eth', fullName: 'ethereum', sort: 6, count: 0, costPrice: 1840 },
            { name: 'doge', fullName: 'dogecoin', sort: 7, count: 0, costPrice: 0 },
            { name: 'uni', fullName: 'uniswap', sort: 8, count: 0, costPrice: 0 },
        ];
        setInterval(() => {
            const res = targetArr.reduce((prev, item) => {
                const elem = document.querySelector(`a[href="/currencies/${item.fullName}/"]`);
                if(!elem) return prev;
                const price = elem.parentElement.parentElement.nextElementSibling.nextElementSibling.innerText
                const rise = elem.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
                // let index = 0;
                // let targetElm = elem.parentElement.parentElement;
                // while(index < 6) {
                //     targetElm = targetElm.nextElementSibling;
                //     index++;
                // }
                // const rise = targetElm.innerText;
                prev.push({ ...item, price, rise });
                console.debug(item.name, price)
                return prev
            }, []);
            console.info(JSON.stringify(res))
        }, 1000);
    });

})();

// 有的价格没变动

// 定时计算爬取后的数据
(() => {
    setInterval(() => {
        // let arr = superData.huoBi.concat(superData.binance).concat(superData.temp);
        let arr = superData.feixiaohao;
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
