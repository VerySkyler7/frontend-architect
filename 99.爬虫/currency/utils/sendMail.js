const nodemailer = require('nodemailer');
const { beforeMail } = require('./beforeMail');

const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'wangxpengx@163.com', // generated ethereal user
        pass: 'ONRXIIYHFIVOWVNW' // generated ethereal password
    }
});

const sendMail = (params) => {

    const { subject, html, mailKey } = params;

    if (!beforeMail(mailKey)) return;

    let mailOptions = {
        from: 'wangxpengx@163.com', // sender address
        to: '379522872@qq.com', // list of receivers
        subject, // Subject line
        html // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });
}

module.exports = {
    sendMail
}