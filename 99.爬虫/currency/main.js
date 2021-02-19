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
        const targetArr = [
            {name: 'BNB', sort: 3, count: 31.4, costPrice: 50}, // 
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
        if (msg._type === 'info')  superArr.huoBi = JSON.parse(msg._text)
    })

    await page.evaluate(() => {
        const targetArr = [
            {name: 'badger', sort: 0, count: 28, costPrice: 57}, 
            {name: 'dot', sort: 1, count: 2427, costPrice: 4}, 
            {name: 'ksm', sort: 2, count: 167.75, costPrice: 103}, // 214 * 7
            {name: 'xem', sort: 4, count: 3317, costPrice: 0.47},
            {name: 'mdx', sort: 5, count: 1421, costPrice: 3}, 
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
        let arr = superArr.huoBi.concat(superArr.binance);
        if(arr.length > 8) {
            arr = arr.sort((a, b) => a.sort - b.sort)
        }

        let total = 0;
        const res = arr.reduce((prev, item) => {
            total += item.price * item.count;
            return prev + item.name.toLocaleUpperCase() + ':' + item.price + ':' + item.rise + ':' + Number(Number(item.price) * item.count * 6.4).toFixed(2) + '  '
        }, '');
        if(res) console.log('total:' + Number(total * 6.4).toFixed(2) + ' ' + res)
    }, 1000);
})();