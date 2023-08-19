// 当前脚本辅助动态设置process.env公用值
module.exports = (env, args) => {
  process.env.NODE_ENV = args.mode
  process.env.platform = env.platform
}
