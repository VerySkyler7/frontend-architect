const request = require("request");
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

const targetArr = [
  { name: "BNB", sort: 4, count: 35, costPrice: 50 },
  { name: "XVS", sort: 0.5, count: 32.9, costPrice: 87 },
  { name: "CAKE", sort: 6, count: 35, costPrice: 11.4 },
  { name: "BADGER", sort: 0, count: 28, costPrice: 57 },
  { name: "DOT", sort: 1, count: 2430, costPrice: 4 },
  { name: "KSM", sort: 2, count: 161.29, costPrice: 103 }, // 214 * 7
  { name: "MDX", sort: 3, count: 1669, costPrice: 3 },
  { name: "HT", sort: 6.5, count: 10, costPrice: 12 },
  { name: "BTC", sort: 7, count: 0.0082, costPrice: 0 },
  { name: "ETH", sort: 8, count: 0, costPrice: 0 },
  { name: "POLS", sort: 8, count: 0, costPrice: 0 },
];

let count = 0;
let prevTotal = 0;

(() => {
  setInterval(async () => {
    let i = 1;
    while (true) {
      if (count < targetArr.length) {
        await getPrice(i);
        i++;
      } else {
        count = 0;
        break;
      }
    }
  }, 10000);
})();

// 定时计算爬取后的数据
(() => {
    setInterval(() => {

        const res = targetArr.reduce((prev, item) => {
            prev.total += item.price * item.count;
            prev.price += item.name.toLocaleLowerCase()
                + '  price：' + item.price
                + '  costPrice：' + item.costPrice
                + '  rise：' + item.rise
                + '  total：' + Number(Number(item.price) * item.count * 6.4).toFixed(2)
                + '  profit：' + Number(item.count * (item.price - item.costPrice) * 6.4).toFixed(2) + '<br>\r\n'
            return prev
        }, { total: 0, price: '' });

        if (res.total) {
            res.total = Number(res.total * 6.4).toFixed(2);
            if (Math.abs(res.total - prevTotal) > 20000) { // 当波动大于1万时 发一个邮件
                prevTotal = res.total;
                sendMail(res.total, res.price + 'total：' + res.total)
            }
            console.log(res.price + 'total：' + res.total)
        }
    }, 10000);
})();


function sendMail(subject, html) {
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

function getPrice(i) {
  return new Promise((resolve) => {
    request(
      "https://dncapi.bqrank.net/api/coin/web-coinrank?webp=1&pagesize=100&page=" +
        i +
        "&type=-1",
      (err, res, body) => {
        if (!err && res.statusCode == 200) {
          const resData = JSON.parse(body);
          if (resData.code == 200) {
            const dataArr = resData.data;
            targetArr.forEach((item) => {
              dataArr.forEach((d) => {
                if (item.name === d.name) {
                  item.price = d.current_price_usd;
                  item.rise = d.change_percent;
                  count++;
                }
              });
            });
          }
        }
        resolve();
      }
    );
  });
}
