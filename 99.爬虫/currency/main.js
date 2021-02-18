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
        const targetArr = ['BNB', 'XVS', 'SFP'];
        setInterval(() => {
            const res = targetArr.reduce((prev, name) => {
                const nameElm = document.querySelector(`td[title=${name}]`);
                if (!nameElm) return prev;

                const price = nameElm.nextElementSibling.innerText;
                const rise = nameElm.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
                prev.push({ name, price, rise })
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
        const targetArr = ['dot', 'ksm', 'btc', 'eth', 'badger', 'mdx', 'pols'];
        setInterval(() => {
            const res = targetArr.reduce((prev, name) => {
                const firstElm = document.querySelector(`#${name}usdt`).firstElementChild.firstElementChild;
                if (!firstElm) return prev;
                const price = firstElm.nextElementSibling.innerText.split("≈")[0].trim();
                const rise = firstElm.nextElementSibling.nextElementSibling.innerText;
                prev.push({ name, price, rise })
                return prev
            }, []);
            console.info(JSON.stringify(res))
        }, 1000);
    });

})();

; (() => {
    setInterval(() => {
        const arr = superArr.huoBi.concat(superArr.binance);
        const res = arr.reduce((prev, item) => {
            // console.log(prev + item.name.toLocaleUpperCase() + ':' + item.price + ':' + item.rise + '  ')
            return prev + item.name.toLocaleUpperCase() + ':' + item.price + ':' + item.rise + '  '
        }, '');
        if(res) console.log(res)
    }, 1000);
})();