import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, delay, map } from 'rxjs/operators';

import { Events } from '@/utils/eventProxy';
import { ResponseError, ErrorType } from './error';
import { message } from 'antd';

function processResponse(res) {
  if (res.response) {
    try {
      const response = JSON.parse(res.response);
      if (Number(response.status_code) === 6013) {
        Events.trigger('response_6013'); // 维护信息
        return { data: response };
      }
      if (Number(response.status_code) === 6001) {
        Events.trigger('response_6001'); // 登录失效
        return { data: response };
      } else {
        return { data: response };
      }
    } catch (e) {
      return { data: res.response };
    }
  }
  return { data: {} };
}
/**
 * @param  {object} options 请求配置
 * @returns Observable
 */
export default function request(
  options = { method: 'GET', credentials: 'include' } as any,
): Observable<any> {
  if (!options.url) {
    alert('请求接口地址不能为空');
  }
  return ajax({
    withCredentials: true,
    ...options,
    // body: options.body,
    crossDomain: true,
    timeout: 15000,
    responseType: '',
  }).pipe(
    delay(400),
    map(processResponse),
    catchError((err) => {
      const isTimeOut = err.message.includes('timeout');
      if (isTimeOut) {
        message.info(ErrorType.timeout, 1.5);
      }

      const { status = null, response = {} } = err || {};

      return of({
        data: new ResponseError(
          isTimeOut ? ErrorType.timeout : ErrorType.network,
          status,
          response,
        ),
      });
    }),
  );
}
