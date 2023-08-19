import AjaxCancelError from 'sunny-js/request/AjaxCancelError';
import { isPlainObj } from 'sunny-js/util/object';
import BusinessError from './businessError';
import requestChannel, { createAction } from './channel';
import ConnectionError from './connectionError';

// 响应体接口。字段映射
const ResponseFieldMap = {
  code: 'status_code',
  message: 'message',
  // data: 'data',
};
function detectBusinessError(response) {
  // console.log('Low level response emit ', response)
  // 处理业务接口公共错误码，并抛出异常
  // 创建业务异常对象
  let error;
  if (
    isPlainObj(response) &&
    // @ts-ignore
    parseInt(response[ResponseFieldMap.code], 10) !== BusinessError.DONE
  ) {
    error = new BusinessError(
      response[ResponseFieldMap.code],
      response[ResponseFieldMap.message],
      response,
    );
  }
  if (error) {
    return Promise.reject(error);
  }
  return Promise.resolve();
}

/**
 * 请求异常处理分三个生命周期方法，分别是
 * 异常创建
 * beforeCatchError
 * detectError // 检测业务异常，并返回异常对象
 * 异常处理
 * afterCatchError
 */

/**
 * 第一个捕获异常的钩子方法
 * 可以用来创建业务异常或连接异常
 * @param error
 * @returns {undefined|BusinessError|ConnectionError}
 */
export function beforeCatchError(error) {
  // 通用异常创建
  const response = error.response;
  return response
    ? new BusinessError(
        response[ResponseFieldMap.code],
        response[ResponseFieldMap.message],
        response,
      )
    : new ConnectionError(error);
}

/**
 * 第二个检测异常的钩子方法
 * 可以在后端接口正常返回时，探测是否为异常业务代码，从而决定是否创建BusinessError
 * @param ajaxResponse
 * @returns {Promise<BusinessError|undefined>}
 */
export function detectError(ajaxResponse) {
  const response = ajaxResponse.response;
  if (response instanceof Blob && response.type.indexOf('json') !== -1) {
    return response.text().then((responseText) => detectBusinessError(JSON.parse(responseText)));
  }
  return detectBusinessError(response);
}

/**
 * 第三个捕获异常的钩子方法
 * 在经过前面两个创建异常方法的铺垫后，这个方法用来调用异常处理逻辑
 * @param error
 * @returns {undefined} 需要返回error实例
 */
export function afterCatchError(error) {
  // console.error('Low level error emit ', error)

  // console.dir(error)
  console.debug(BusinessError.name, error instanceof BusinessError);
  console.debug(ConnectionError.name, error instanceof ConnectionError);
  console.debug(AjaxCancelError.name, error instanceof AjaxCancelError);
  console.debug(Error.name, error instanceof Error);

  /**
   * 通用异常处理
   * 通过requestChannel请求频道广播发送异常事件通知，由外部对事件感兴趣对相关逻辑处理
   */
  requestChannel.next(createAction(error.constructor.name, error));
}

export function isSessionError(error) {
  // @ts-ignore
  return error.code === BusinessError.TOKEN_EXPIRED;
}

export function isConnectionError(error) {
  return error instanceof ConnectionError;
}

export function isBusinessError(error) {
  return error instanceof BusinessError;
}
