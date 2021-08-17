/**
 * 捕获单个coin的价格
 * 对不同的价格做不同的逻辑处理
 */

const { BTC_CAPTURE_PRICE, BTC_CAPTURE_PRICE_UP, BTC_CAPTURE_PRICE_DOWN } = require("./config");
const { MailKeys } = require("./utils/beforeMail");
const { sendMail } = require("./utils/sendMail");

let ksmPrice = 0;
let dotPrice = 0;
let dogePrice = 0;
let s = null;
const strategyCoinFun = {}

/**
 * 监测单个coin的价格
 */
const captureCoin = (coin) => {
    let { name } = coin;
    name = name.toUpperCase();
    const coinFun = strategyCoinFun[name];
    if (!coinFun) return;
    coinFun(coin);
}

/**
 * BTC的处理逻辑
 */
strategyCoinFun.BTC = (coin) => {
    const { price } = coin;
    if (price > BTC_CAPTURE_PRICE_UP) {
        sendMail({
            subject: 'BTC价格超过了' + BTC_CAPTURE_PRICE_UP,
            html: '',
            mailKey: MailKeys.BTC_CAPTURED
        })
    }

    if (price < BTC_CAPTURE_PRICE_DOWN) {
        sendMail({
            subject: 'BTC价格跌破了' + BTC_CAPTURE_PRICE,
            html: '',
            mailKey: MailKeys.BTC_CAPTURED
        })
    }
}

/**
 * 比对dot和ksm的价格，用于做波段
 * @returns 
 */
const getKsm2DotRatio = (coinName, coinPrice) => {

    if (coinName === 'ksm') {
        ksmPrice = coinPrice;
    } else if (coinName === 'dot') {
        dotPrice = coinPrice;
    } else {
        return;
    }

    const ratio = ksmPrice / dotPrice;
    console.log('ksm/dot/ratio:', ratio.toFixed(2))

    if (s) return;
    if (ratio > 0 && ratio < 16.8) {
        s = setTimeout(() => {
            s = null;
            sendMail({
                subject: 'KSM/DOT',
                html: ratio.toFixed(2),
                mailKey: MailKeys.KSM_DOT
            });
        }, 1000 * 60 * 15);
    }
}

/**
 * 比对doge和dot的价格，用于将dot换成doge
 * @returns 
 */
 const getDot2DogeRatio = (coinName, coinPrice) => {

    if (coinName === 'dot') {
        dotPrice = coinPrice;
    } else if (coinName === 'doge') {
        dogePrice = coinPrice;
    } else {
        return;
    }

    const ratio = dotPrice / dogePrice;
    console.log('dot/doge/ratio:', ratio.toFixed(2))

    if (ratio > 100 && dogePrice > 0) {
        sendMail({
            subject: 'DOT/DOGE',
            html: ratio.toFixed(2),
            mailKey: MailKeys.KSM_DOT
        });
    }
}

module.exports = {
    getKsm2DotRatio,
    getDot2DogeRatio,
    captureCoin
}
