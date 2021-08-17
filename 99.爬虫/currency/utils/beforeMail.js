const { MAIL_LIMIT_TIME } = require("../config");

/**
 * mailKeys 用于区别不同业务的邮件
 * 同一业务的邮件，可能会做时间间隔的处理
 */
const MailKeys = {
    /** 监测总资产变化 */
    TOTAL_ASSET: "TOTAL_ASSET",
    /**  捕获BTC价格 */
    BTC_CAPTURED: "BTC_CAPTURED",
    /** 捕获KSM和DOT的价格 */
    KSM_DOT: "KSM_DOT",
    /** 捕获DOT和DOGE的价格 */
    KSM_DOT: "DOT_DOGE",
}

/**
 * 用于存储邮件的发送时间
 * key：业务id
 * value：发送邮件的时间戳
 */
const mailLimits = {}

/**
 * 第一次发邮件，给该业务邮件加上时间戳标识
 * 第一次发送则返回true，反之false
 */
const isFirstMail = mailKey => {
    if(!mailLimits[mailKey]) {
        mailLimits[mailKey] = Date.now();
        return true;
    }
    return false;
}

/**
 * 判断该邮件是否已超过限制时间，如果超过则可以发送，如果未超过则不能发送
 */
const isLimitSend = mailKey => Date.now() - mailLimits[mailKey] > MAIL_LIMIT_TIME;

/**
 * 更新发送邮件的时间戳
 */
const updateMailLimit = mailKey => mailLimits[mailKey] = Date.now();

/**
 * 返回false，说明没有超过限定的时间，不允许发送邮件
 * 返回true，说明超过限定的时间，同时更新发送邮件的时间戳
 */
const beforeMail = (mailKey) => {
    if(isFirstMail(mailKey)) return true;
    if(!isLimitSend(mailKey)) return false;
    updateMailLimit(mailKey);
    return true;
}

module.exports = {
    MailKeys,
    isLimitSend,
    updateMailLimit,
    beforeMail,
}