// https://www.cnblogs.com/wuweiblogs/p/12918923.html

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false })

    const page = await browser.newPage();
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


// const puppeteer = require('puppeteer');

// (async () => {
//  let width = 1600
//  let height = 960
//  const browser = await puppeteer.launch({
//   // 没有图形界面的浏览器
//   headless: false,
//   // 当自动测试时，需要让浏览器忽略证书错误，就可以打开 ignoreHTTPSErrors ， 默认为 false
//   ignoreHTTPSErrors : true,
//   // 放缓速度 毫秒
//   // slowMo: 300,
//   args: [
//    '--no-sandbox',
//    '--disable-setuid-sandbox',
//    `--window-size=${width},${height}`
//   ],
//   // 调试模式
//   devtools: true
//  })

//  let page = await browser.newPage();
//  // page = (await browser.pages())[0]

//  // 重置高宽
//  await page.setViewport({
//   width: 1920,
//   height: 1080
//  });

//  await page.addScriptTag({url: 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js'})

//  /**
//   waitUntil参数是来确定满足什么条件才认为页面跳转完成。包括以下事件：
//   load - 页面的load事件触发时
//   domcontentloaded - 页面的DOMContentLoaded事件触发时
//   networkidle0 - 不再有网络连接时触发（至少500毫秒后）
//   networkidle2 - 只有2个网络连接时触发（至少500毫秒后）
//   */
//  await page.goto("https://item.jd.com/100006622021.html", { waitUntil: 'networkidle2' }); 
//  // await page.click('a[href="http://tieba.baidu.com"]')

//  // 等待3000ms，等待浏览器的加载
//  await page.waitFor(3000);

//  // 断点
//  // await page.evaluate(() => {debugger;});

//  // 调试日志
//  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
//  await page.evaluate(() => console.log(`url is ${location.href}`));
//  await page.evaluate(() => console.log(`url is ${location.href}`));

//  // 判断当前url
//  // if (page.url() === 'https://item.jd.com/100006622021.html'){ 
//   //  alert(1)
//  // }
 
//  // 直接执行js
//  const emojis = await page.evaluate(() => {
  
//   // let initCartUrl = document.getElementById('InitCartUrl').click()

  
//     // let ol = document.getElementsByClassName('emoji-grid')[0]
//     // let imgs = ol.getElementsByTagName('img')
//     // let url = []
//     // for (let i = 0; i < 97; i++) {
//     //   url.push(imgs[i].getAttribute('src'))
//     // }
//     // 返回所有emoji的url地址数组
//     return null
//   })

//  let maxPage = 1000

//  for (let i = 0; i < maxPage; i++) {
//   await page.waitFor(500);
//   await page.evaluate(() => console.log(`url is ${location.href}`));
//  }

//  // const newPage = (await browser.pages())[2];
//  // newPage.click('a[href="//tieba.baidu.com"]')
//  // await timeout(5000);
//  // 关闭
//  // await browser.close();
// })();