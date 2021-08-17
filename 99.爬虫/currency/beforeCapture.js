// 获取汇率
const getExchangeRage = async (buyUPage, superData) => {
    await buyUPage.goto('https://www.okex.com/buy-usdt', { timeout: 9999999 })
    buyUPage.on('console', msg => {
        if (msg._type === 'info') superData.exchangeRage = msg._text
    });
    await buyUPage.evaluate(() => {
        const targetValue = document.querySelector('.common-quick-price-value').firstChild.innerText.match(/[\d|\.]+/g)[0];
        console.info(targetValue);
    });
    buyUPage.close();
}

module.exports = {
    getExchangeRage
}