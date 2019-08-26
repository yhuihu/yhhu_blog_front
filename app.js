const fs = require('fs'); //文件模块
const path = require('path'); //路径模块
const express = require('express'); //express框架模块
const app = express();
const hostName = 'localhost'; //ip
const port = 8002; //端口

app.use(express.static(path.resolve(__dirname, './dist'))); // 设置静态目录(例：app.js在demo目录下，那么目录则为demo/dist)。

app.get('*', function (req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8'); // 设置所有访问服务请求默认返回index.html文件
  res.send(html);
});

app.listen(port, hostName, function () {
  console.log(`服务器运行在http://${hostName}:${port}`);
});