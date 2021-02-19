const puppeteer = require('puppeteer');

const superArr = {
    binance: [],
    huoBi: []
};


(async () => {
    const browser = await puppeteer.launch({ headless: true })
    
    const page = await browser.newPage()
    await page.goto('https://cn.investing.com/crypto/currencies', { timeout: 9999999 })
    page.on('console', msg => {
        if (msg._type === 'info') superArr.binance = JSON.parse(msg._text)
    })
    await page.evaluate(() => {
        const targetArr = [{name: 'BNB', sort: 3}, {name: 'XVS', sort: 4}, {name: 'CAKE', sort: 6}];
        setInterval(() => {
            const res = targetArr.reduce((prev, item) => {
                const nameElm = document.querySelector(`td[title=${item.name}]`);
                if (!nameElm) return prev;

                const price = nameElm.nextElementSibling.innerText;
                const rise = nameElm.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
                prev.push({ name: item.name, price, rise, sort: item.sort })
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
        if (msg._type === 'info')  superArr.huoBi = JSON.parse(msg._text)
    })

    await page.evaluate(() => {
        const targetArr = [{name: 'dot', sort: 1}, {name: 'ksm', sort: 2}, {name: 'mdx', sort: 5}, {name: 'btc', sort: 7}, {name: 'eth', sort: 8}, {name: 'badger', sort: 0}, {name: 'pols', sort: 9},  {name: 'xem', sort: -1}];
        setInterval(() => {
            const res = targetArr.reduce((prev, item) => {
                const firstElm = document.querySelector(`#${item.name}usdt`).firstElementChild.firstElementChild;
                if (!firstElm) return prev;
                const price = firstElm.nextElementSibling.innerText.split("≈")[0].trim();
                const rise = firstElm.nextElementSibling.nextElementSibling.innerText;
                prev.push({ name: item.name, price, rise, sort: item.sort })
                return prev
            }, []);
            console.info(JSON.stringify(res))
        }, 1000);
    });

})();

; (() => {
    setInterval(() => {
        let arr = superArr.huoBi.concat(superArr.binance);
        if(arr.length > 8) {
            arr = arr.sort((a, b) => a.sort - b.sort)
        }
        const res = arr.reduce((prev, item) => {
            // console.log(prev + item.name.toLocaleUpperCase() + ':' + item.price + ':' + item.rise + '  ')
            return prev + item.name.toLocaleUpperCase() + ':' + item.price + ':' + item.rise + '  '
        }, '');
        if(res) console.log(res)
    }, 1000);
})();