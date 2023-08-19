/**
 * 生成路由文件匹配正则，视图按需编译
 * @param {string[]} [requiredViews] 输入应用启动所必须使用的视图文件夹名称 e.g. ['FooView', 'BarView']
 * @param {string|string[]} [optionalViews] e.g. 'FooView,BarView' or ['FooView', 'BarView']
 * @returns {RegExp}
 * @example
 * // 假设你有三个视图
 * // 1. LayoutView/route.ts 应用启动时必须使用，其他视图依赖此视图
 * // 2. FooView/route.ts 可选Foo视图，具体实现某个页面整体交互的视图
 * // 3. BarView/route.ts 可选Bar视图

 * const ROUTE_FILTER = generateRouteFilter(['LayoutView'], env.views)
 * // webpack EnvironmentPlugin
 * new webpack.EnvironmentPlugin({
 *   'process.env.ROUTE_FILTER': ROUTE_FILTER
 * })
 * // router.implement.ts文件中使用ROUTE_FILTER
 * require.context('../', true, process.env.ROUTE_FILTER as any)
 * // 即可告知webpack检索由正则指定的路由文件
 */
function generateRouteFilter(requiredViews, optionalViews) {
  // 视图入口默认正则
  if (!requiredViews && !optionalViews) {
    return /(\w+View\/index|\/route)\.[a-z]+$/i;
  }

  if (typeof optionalViews === 'string') {
    optionalViews = optionalViews.split(',').map((item) => item.trim());
  }
  const views = requiredViews.concat(optionalViews);
  // 生成按需配置视图入口的正则
  return RegExp(`(${views.join('|')})/route\\.[a-z]+$`, 'i');
}
exports.generateRouteFilter = generateRouteFilter;
