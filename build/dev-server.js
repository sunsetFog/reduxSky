const upstreamProxyServer = require('./upstream-proxy-server')
const { currentPlatformConf } = require('./platformConf')
/**
 * 开发服务器配置
 * 更多配置选项 https://webpack.js.org/configuration/dev-server/
 */
module.exports = {
  port: currentPlatformConf.port,
  proxy: [
    {
      context: ['/agent'],
      target: currentPlatformConf.apiTarget,
      /**
       * 设置上层代理
       * https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/corporate-proxy.md
       */
      agent: upstreamProxyServer(),
      changeOrigin: true,
      // pathRewrite: {
      //   '^/assets': ''
      // }
    },
  ],
}
