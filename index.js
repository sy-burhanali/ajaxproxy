var express = require("express");
var proxy = require("http-proxy-middleware");
var cors = require('cors');

// proxy middleware options
var filter = function (pathname, req) {
  return req.headers.origin === "http://127.0.0.1:5500";
};

var apiOptions = {
  target: "https://samples.openweathermap.org",
  changeOrigin: true,
  pathRewrite: {
    "^/ec/": "/",
  },
  onProxyReq: (proxyReq) => {
    proxyReq.path += "&appid=" + process.env.EC_APIKEY;
  },
  logLevel: "debug",
};

var apiProxy = proxy(filter, apiOptions);

var app = express();
app.set("port", process.env.PORT || 5000);

// Allow all origins
app.use(cors());

app.use("/ec", apiProxy);

app.listen(app.get("port"));


// app.use(cors({
//     origin: ['http://127.0.0.1:5500', 'https://127.0.0.1:5500']
// }));
