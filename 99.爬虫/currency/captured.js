const { sendMail } = require("./utils/mailUtil");

let ksmPrice = 0;
let dotPrice = 0;
let count = 0; // 邮件的发送次数 大于三次后不再发送
let s = null;

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
            sendMail('KSM/DOT', ratio.toFixed(2));
        }, 1000 * 60 * 15);
    }
}

module.exports = {
    getKsm2DotRatio
}