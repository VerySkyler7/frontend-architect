/**
 * 捕获单个coin的价格
 * 对不同的价格做不同的逻辑处理
 */

const { BTC_CAPTURE_PRICE } = require("./config");
const { MailKeys } = require("./utils/beforeMail");
const { sendMail } = require("./utils/sendMail");

let ksmPrice = 0;
let dotPrice = 0;
let count = 0; // 邮件的发送次数 大于三次后不再发送
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
    if (price > BTC_CAPTURE_PRICE) {
        sendMail({
            subject: 'BTC价格超过了' + BTC_CAPTURE_PRICE,
            html: '',
            mailKey: MailKeys.BTC_CAPTURED
        })
    }
}

/**
 * 已作废
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
    if (ratio > 0 && ratio < 16.8 && count < 3) {
        s = setTimeout(() => {
            s = null;
            count++;
            sendMail({
                subject: 'KSM/DOT',
                html: ratio.toFixed(2),
                mailKey: MailKeys.KSM_DOT
            });
        }, 1000 * 60 * 15);
    }
}

module.exports = {
    getKsm2DotRatio,
    captureCoin
}