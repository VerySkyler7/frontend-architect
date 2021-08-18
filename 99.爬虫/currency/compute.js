/**
 * 捕获单个coin的价格
 * 对不同的价格做不同的逻辑处理
 */

const { BTC_CAPTURE_PRICE, BTC_CAPTURE_PRICE_UP, BTC_CAPTURE_PRICE_DOWN } = require("./config");
const { MailKeys } = require("./utils/beforeMail");
const { sendMail } = require("./utils/sendMail");

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
 * 计算指定coin之间的比率
 * coinName1 的price是除数，coinName2 是被除数
 * manitorRatio 监测发邮件的比例
 * isGreater 是否为大于监测的比例时发邮件
 * @returns 
 */
 const getMonitorRatio = ({coinList, coinName1, coinName2, monitorRatio, isGreater}) => {
     if(!coinList || !coinList.length) return;
     
     const price1 = coinList.find(item => item.name === coinName1).price;
     const price2 = coinList.find(item => item.name === coinName2).price;
     if(!price1 || !price2) return;

    const ratio = price1 / price2;
    console.log(`${coinName1}/${coinName2} ratio:`, ratio.toFixed(2));
    
    if((isGreater && ratio > monitorRatio) || (!isGreater && ratio < monitorRatio)) {
        sendMail({
            subject: `${coinName1}/${coinName2}`,
            html: ratio.toFixed(2),
            mailKey: MailKeys.KSM_DOT
        });
    }
}

module.exports = {
    getMonitorRatio,
    captureCoin
}
