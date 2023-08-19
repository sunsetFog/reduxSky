// import store from '@/views/container/store';
import { Route } from 'react-router';
// import { implement as AuthImplement } from 'sunny-foundation/Auth';
import AuthRoute from 'sunny-foundation/Auth/AuthRoute';
// import { requestLogin as forwardToLogin } from 'sunny-foundation/Auth/channel';
import { useCustomRoute } from 'sunny-foundation/PluggableRouter/transform';
// import {
//   hasLiveChat,
//   hasPublicSource,
//   hasSetPayPasswordInfo,
//   isLogin,
//   updateLiveChat,
//   updateSetPayPasswordInfo,
//   updateUserSource,
// } from '../user/userRDM/helper';
// import { userSourceSVC, liveChatSVC, getSetPayPasswordInfo } from '../user/service';
// import { IS_SHOW } from '@/views/container/appRDM/appActions';
import 'core-js';
// 认证模块接口实现
// 实现基本的登录认证
// noinspection JSUnusedGlobalSymbols
// AuthImplement({
//   authenticate() {
//     //session 获取是否已授权登陆且无其它拦截逻辑,（受 accountVerifyModal 组件强制绑定逻辑影响）
//     const isRouterBlock = +sessionStorage.getItem('_routerBlock');
//     // console.log(isLogin(), isRouterBlock, 'isRouterBlock');
//     if (isLogin() && !isRouterBlock) {
//       return Promise.any([
//         // 准备好用户信息
//         hasPublicSource()
//           ? Promise.resolve()
//           : userSourceSVC()
//               .then(({ data }) => updateUserSource(data))
//               .finally(() => store.dispatch({ type: IS_SHOW, payload: false })),
//         // do something else
//         hasLiveChat() ? Promise.resolve() : liveChatSVC().then(({ data }) => updateLiveChat(data)),
//         hasSetPayPasswordInfo()
//           ? Promise.resolve()
//           : getSetPayPasswordInfo().then(({ data }) => {
//               localStorage.setItem(
//                 'userInfo',
//                 JSON.stringify(
//                   Object.assign({}, JSON.parse(localStorage.getItem('userInfo')), {
//                     pay_status: data.pay_status,
//                   }),
//                 ),
//               );
//               updateSetPayPasswordInfo(data);
//             }),
//       ]);
//     }
//     return Promise.reject();
//   },
//   forwardToLogin,
// });
/**
 * 为PluggableRouter模块，使用自定义路由组件
 * 自定义选择路由组件的逻辑，可以为路由增加特别功能
 * 这里我们为路由配置增加了一个auth认证功能
 */
useCustomRoute((route) => {
  // 后台管理项目默认启用认证路由
  // 适用于后台管理
  return route.auth === false ? Route : AuthRoute;
  // 适用于前端web应用
  // return route.auth ? AuthRoute : Route
});
