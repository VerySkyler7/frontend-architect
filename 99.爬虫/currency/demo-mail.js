const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'wangxpengx@163.com', // generated ethereal user
        pass: 'ONRXIIYHFIVOWVNW' // generated ethereal password
    }
});

let mailOptions = {
    from: 'wangxpengx@163.com', // sender address
    to: '379522872@qq.com', // list of receivers
    subject: '标题：这是一封来自Nodejs发送的邮件', // Subject line
    text: '你好吗?', // plain text body
    html: '<b>北京欢迎你</b>' // html body
};


transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

});

