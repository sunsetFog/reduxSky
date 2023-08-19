import { onBlocked } from 'sunny-foundation/Auth/channel';
import { debounce } from 'sunny-js/util/function';
import { Modal } from 'antd';
import { errorConfirm, modelConfirmConfig } from './auth.story';
import { isConnectionError, isSessionError } from '@/library/request/errorHandler';

// 监听 用户被阻止访问 通知
const blockHandler = (err) => {
  if (err instanceof Error) {
    if (isSessionError(err)) {
      return;
    } // 跳过可能产生的登录超时
    // 接口网络请求产生了异常
    if (isConnectionError(err)) {
      return errorConfirm();
    }
  }

  console.info('The visitor is not allowed to go', location);
  Modal.confirm({
    ...modelConfirmConfig,
    title: '访问被阻止',
    content: '当前未授权的访问被阻止了，是否返回主页？取消则刷新当前页面。',
  });
};
onBlocked(debounce(blockHandler, 500), blockHandler);
