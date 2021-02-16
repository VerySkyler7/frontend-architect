const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// 当前视频索引
let index = 0;
// 当前页数
let page = 0;

(async () => {
    const browser = await puppeteer.launch({ headless: true }); // false 显示打开浏览器
    // 存放抓取后的全量数据
    const list = [];
    // 首页
    // let homeUrl = 'https://www.xvideos.com';
    // await runOneList(homeUrl, browser, list);

    // 循环每一页
    for (let i = 28; i < 20000; i++) {
        try {
            page = i + 1;
            const detailUrl = 'https://www.xvideos.com/new/' + i;
            await runOneList(detailUrl, browser, list);
        } catch (error) {
            console.log('================================', error);
        }
    }
    await browser.close();
})();


// 在列表页获取每个视频的title和href， 返回list
async function getHref(page) {
    return page.evaluate(() => {
        const ps = document.querySelectorAll('.title')
        // console.log(ps)
        return Array.from(ps).map(p => ({
            title: p.children[0] && p.children[0].innerText,
            href: p.children[0] && p.children[0].href
        }))
    });
}

// 在详情页获取赞，并添加到list中
async function addPraise(list, browser) {
    // 循环列表 到详情页获取👍
    for (let i = 0; i < list.length; i++) {
        try {
            if(!list[i].href) continue;
            let page = await browser.newPage();
            await page.goto(list[i].href)
            const [praise, critical] = await page.evaluate(() => {
                const [praiseElm, criticalElm] = document.querySelectorAll('.rating-inbtn');
                return [praiseElm?.innerText, criticalElm?.innerText];
            })
            list[i].praise = praise;
            list[i].critical = critical;
            writeFile(list[i]);
            page.close();
        } catch (error) {
            console.log('------------------------------', error);
        }
    }

    return list;
}

function writeFile(data) {
    console.log(page + '-' + index++);
    const str = JSON.stringify(data) + ",";
    fs.writeFile(path.resolve(__dirname, 'info1.json'), str, { flag: 'a' }, (err) => {
        if(err) {
            console.log(err)
        }
    });
}

// 处理一个列表页及每个详情页
async function runOneList(url, browser, list) {
    let page = await browser.newPage();
    await page.goto(url); // 等待页面network加载完毕
    const newList = await getHref(page);
    await page.close();

    await addPraise(newList, browser);
    // list.push(newList);
    // console.log('list.length:::', list.length)
    return list;
}
