import { onSessionError } from '@/library/request/channel';
import { isSessionError } from '@/library/request/errorHandler';
import { clearCacheLoginInfo } from '@/utils/helpers';
import { Modal } from 'antd';
import { onLoginSuccess, onLogout, onRequestLogin } from 'sunny-foundation/Auth/channel';
import history from 'sunny-foundation/PluggableRouter/history';
import { useRoutes } from 'sunny-foundation/PluggableRouter/transform';

// noinspection JSUnusedGlobalSymbols
export const modelConfirmConfig = {
  title: '发生错误，请稍后再试',
  content: '是否返回主页？取消则刷新当前页面。',
  onOk() {
    history.push('/home/homeView');
  },
  onCancel() {
    location.reload();
  },
};

export function errorConfirm() {
  Modal.confirm(modelConfirmConfig);
}

/**
 * 只要业务视图有和登录认证相关的业务，引入此文件，都能够正常响应
 * onRequestLogin、onSessionError、onLoginSuccess等事件的交互
 */

function forwardToLoginView(from = history.location) {
  const to = useRoutes('login').toPath();
  if (!to) {
    return console.warn('You are asked to specify a route as the key should be login, e.g. ', {
      key: 'login',
      path: 'user/login',
    });
  }
  // 如果将登录事件绑定到请求上，可能会多次发送登录事件，加上是否已经在登录界面到判断
  // 如果已经在登录界面，还接收到登录事件，则可以忽略
  if (to !== from.pathname) {
    console.debug('request login, so forward to ', to, ' from ', from);
    history.push(to, { from });
  }
}
// 登录视图检测到登录事件后，执行登录视图跳转
onRequestLogin((payload) => {
  const isErr = payload instanceof Error;
  // 排除token失效的异常
  if (isErr && !isSessionError(payload)) {
    // 统一错误交互
    errorConfirm();
  } else {
    // 异常对象不需要传递
    forwardToLoginView(isErr ? undefined : payload);
  }
});
// 监听会话异常
onSessionError((error) => {
  console.info('token expired', error);
  forwardToLoginView();
});
onLogout(() => {
  console.info('user logout');
  forwardToLoginView();
});
// 监听登录成功通知
onLoginSuccess((from) => {
  console.debug('login success, now go back to', from || 'last page');
  // history.replace(from)
  from ? history.goBack() : history.push('/home/homeView');
});
// 标记当前tab页，如果浏览器清理所有页面，清除登录信息
clearCacheLoginInfo('agentAdminAll');
