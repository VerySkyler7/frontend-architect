const puppeteer = require('puppeteer');

async function launch() {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.setViewport({ width: 1500,  height: 1500 })
    await page.goto('https://queue.coinlist.co/?c=coinlist&e=casper3&t=https%3A%2F%2Fsales.coinlist.co%2Fcasper&cid=en-US&l=Casper%20Sales%20Site%20Layout', { timeout: 9999999 })
}

for(var i = 0; i < 10; i++) {
    launch()
}