// const http = require("request");
// const url  = require("url");

// // 要访问的目标页面
// const targetUrl = "http://www.baidu.com";

// const urlParsed   = url.parse(targetUrl);

// // 代理服务器
// const proxyHost = "http-dyn.abuyun.com";
// const proxyPort = "9020";

// // 代理隧道验证信息
// const proxyUser = "HIB71G71Q106IJKD";
// const proxyPass = "0DFAC40EB938CE4F";

// const base64    = (proxyUser + ":" + proxyPass).toString("base64");

// const options = {
//     host    : proxyHost,
//     port    : proxyPort,
//     path    : targetUrl,
//     method  : "GET",
//     headers : {
//         "Host"                : urlParsed.hostname,
//         "Proxy-Authorization" : "Basic " + base64
//     }
// };

// http
//     .request(options, function(res) {
//         console.log("got response: " + res.statusCode);
//     })
//     .on("error", function(err) {
//         console.log(err);
//     })
//     .end()
// ;              

// const request = require("request");

// // 要访问的目标页面
// const targetUrl = "http://47.104.70.208:3000/?test=2";

// // 代理服务器
// const proxyHost = "http-dyn.abuyun.com";
// const proxyPort = 9020;

// // 代理隧道验证信息
// const proxyUser = "HIB71G71Q106IJKD";
// const proxyPass = "0DFAC40EB938CE4F";

// const proxyUrl = "http://" + proxyUser + ":" + proxyPass + "@" + proxyHost + ":" + proxyPort;

// const proxiedRequest = request.defaults({'proxy': proxyUrl});

// const options = {
//   url     : targetUrl,
//   headers : {
//           }
// };

// proxiedRequest
//     .get(options, function (err, res, body) {
//         console.log("got response: " + res.statusCode + body);
//     })
//     .on("error", function (err) {
//         console.log(err);
//     })


console.log( 4 / 0)