import createChannel, { on } from 'sunny-js/util/Channel';
import BusinessError from './businessError';
import { isSessionError } from './errorHandler';

export * from 'sunny-js/util/Channel';

/**
 * 创建一个公用频道
 * @example
 * // 订阅频道
 * const subscription = channel.subscribe(action => {})
 * // 给频道发送一个广播
 * channel.next(createAction('customEvent', payload))
 * // 取消订阅
 * subscription.unsubscribe()
 */
const requestChannel = createChannel();

/**
 * 监听会话超时异常
 * 该方法如果不注销unsubscribe，会常驻内存，持续监听
 * @param callback 收到请求登录的事件后会调用callback
 * @param {string} [key] 可选，在使用Function.prototype.bind绑定的函数，要求传入
 * @example
 * // 开始监听
 * const subscription = onSessionError((payload) => {})
 * // 注销监听
 * subscription.unsubscribe()
 */
export function onSessionError(callback, key?) {
  return on(
    requestChannel,
    // @ts-ignore
    BusinessError.name,
    (error) => {
      isSessionError(error) && callback(error);
    },
    key || callback + onSessionError.name,
  );
}

export default requestChannel;
