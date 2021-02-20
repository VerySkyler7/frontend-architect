// https://www.cnblogs.com/wuweiblogs/p/12918923.html

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false })

    const page = await browser.newPage();
    await page.goto("https://www.baidu.com", { waitUntil: 'networkidle2' }); 
    await page.click('a[href="http://tieba.baidu.com"]')
    await page.waitFor(3000);
    const newPage = (await browser.pages())[2];
    newPage.click('a[href="//tieba.baidu.com"]')

})();