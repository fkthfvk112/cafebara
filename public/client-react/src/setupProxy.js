const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/sdk/js/kakao.js',
    createProxyMiddleware({
      target: 'https://developers.kakao.com',
      changeOrigin: true,
    })
  );
};
