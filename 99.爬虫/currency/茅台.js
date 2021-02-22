// https://www.cnblogs.com/wuweiblogs/p/12918923.html

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false })

    const page = await browser.newPage({  });
    await page.goto("https://item.jd.com/100006622021.html", { waitUntil: 'networkidle2' });

    while (true) {
        await page.waitForNavigation({
            waitUntil: 'load',
            timeout: 99999999,
        })
        console.log(page.url());
        if(page.url() === 'https://item.jd.com/100006622021.html'){
            break;
        }
    }

    page.evaluate(() => {
        const addBtn = document.querySelector('#InitCartUrl')
        addBtn.click();
    })
    
})();

