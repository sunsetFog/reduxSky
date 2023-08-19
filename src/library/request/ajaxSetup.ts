import { isBob, platform } from '@/utils/helpers';
import { token } from '@/views/user/userRDM/helper';
import { isPlainObj } from 'sunny-js/util/object';
import { afterCatchError, beforeCatchError, detectError } from './errorHandler';

/**
 * 配置底层的ajax行为
 * @param url
 * @param method
 * @param headers
 * @param body
 * @param rest
 * @returns {{headers: {'X-API-TOKEN': *}, beforeCatchError(*=): *, tap: {next(*): void}, method: *, afterCatchError(*=): *, body: *, url: *}|Observable<never>}
 */
export default function ajaxSetup({ url, method, headers = {} as any, body, ...rest }) {
  // 根据后端接口实际情况选择是否要设定业务接口默认传递参数的类型
  if (method.toLowerCase() !== 'get' && isPlainObj(body)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  return {
    url,
    method,
    body,
    // 设定自定义http header
    headers: {
      'X-API-PLAT': platform.toUpperCase(),
      'X-API-TOKEN': token(),
      ...headers,
    },
    // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，并作自定义处理
    beforeCatchError,
    // 检测可能出现的业务异常
    detectError,
    // 重试次数，可以被具体get, post等方法重设
    // retryTimes: 2,
    // 继续将错误抛出，允许当前stream上的其他pipe也可以捕获异常，提供自定义处理的机会
    afterCatchError,
    transformData: (ajaxResponse) => {
      if (isBob) {
        const list = [
          'BOB体育',
          'BOB棋牌',
          'BOB全站',
          'BOB电子',
          'BOB捕鱼',
          'BOB电竞',
          'BOB彩票',
          'BOB真人',
          'BOB用户',
        ];
        const repList = [
          '半岛体育',
          '半岛棋牌',
          '半岛全站',
          '半岛电子',
          '半岛捕鱼',
          '半岛电竞',
          '半岛彩票',
          '半岛真人',
          '半岛用户',
        ];
        let newRep = JSON.stringify(ajaxResponse.response);
        list.forEach((item, idx) => (newRep = newRep.replace(new RegExp(item, 'g'), repList[idx])));
        if (headers?.noTextReplace) {
          const replacementPairs = JSON.parse(newRep.replace(/BOB/gi, '半岛'));
          return replacementPairs;
        } else {
          return JSON.parse(newRep);
        }
      } else {
        return ajaxResponse.response;
      }
    },
    ...rest,
  };
}
