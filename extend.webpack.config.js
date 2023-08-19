/**
 * 环境变量配置段是自下而上继承的，所以无需重复声明。
 * _nodeEnv 环境变量
 * _plugin 插件
 * _entry 入口
 * _output 出口
 * _resolve resolve
 * _module rule
 */
module.exports = {
  _nodeEnv: {},
  _plugin: [],
  _entry: {},
  _output: {},
  _resolve: {},
  _module: {},
  development: {
    _nodeEnv: {},
    _plugin: [],
    _entry: {},
    _output: {},
    _resolve: {},
    _module: {},
  },
  staging: {},
  uat: {},
  production: {},
};
