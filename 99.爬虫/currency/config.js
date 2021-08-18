module.exports = {
    /** 发送邮件间隔时间 */
    MAIL_LIMIT_TIME: 1000 * 60 * 5,
    /** BTC监测价格上涨趋势 */
    BTC_CAPTURE_PRICE_UP: 50000,
    /** BTC监测价格下跌趋势 */
    BTC_CAPTURE_PRICE_DOWN: 35000,
    /** 总资产监测幅度区间 */
    TOTAL_PROPERTY: 20000,
    /** 
     * 监测不同币价之间的比例 
     * coinName1为除数
     */
    MONITOR_RATIO_LIST: [
        {
            coinName1: 'dot',
            coinName2: 'doge',
            monitorRatio: 75,
            isGreater: false
        },
        {
            coinName1: 'btc',
            coinName2: 'dot',
            monitorRatio: 1900,
            isGreater: true
        },
    ]
}