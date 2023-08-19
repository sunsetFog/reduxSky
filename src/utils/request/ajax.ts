import { platform } from '@/utils/helpers';
/**
 * 获取验证码图片url
 * @param {String} url <请求接口url>
 * @param {any}
 */
export const getValidateImgUrl = (
  url: string,
  { method = 'get', body = {} } = {},
): Promise<any> => {
  return new Promise((resolve, reject) => {
    let xmlHttp;

    // xmlHttp兼容做处理
    if ((window as any).XMLHttpRequest) {
      xmlHttp = new XMLHttpRequest();
    } else {
      xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xmlHttp.open(method, url, true);
    xmlHttp.responseType = 'blob';
    xmlHttp.setRequestHeader('client-type', 'web');
    xmlHttp.setRequestHeader('X-API-PLAT', platform.toUpperCase());
    // 设置跨域请求
    // xmlHttp.withCredentials = true;

    // 监听请求状态
    xmlHttp.onreadystatechange = () => {
      const { status, statusText } = xmlHttp;

      if (status !== 200) {
        reject(new Error(statusText));
      }
    };

    xmlHttp.onload = (event: any) => {
      const response = event.target.response;
      const img = new Image();
      const code =
        xmlHttp.getResponseHeader('x-code') ||
        xmlHttp.getResponseHeader('X-Code') ||
        xmlHttp.getResponseHeader('X-CODE');

      img.src = window.URL.createObjectURL(response);
      img.onload = () => {
        // 统一和request方法层级一致
        resolve({
          data: {
            data: {
              url: img.src,
              code,
            },
            status_code: 6000,
          },
        });
      };
      img.onerror = () => {
        // 返回文本解析为json
        const reader = new FileReader();
        reader.readAsText(response, 'utf-8');
        reader.onload = () => {
          resolve({
            data: JSON.parse(reader.result as string),
          });
        };
      };
    };

    xmlHttp.send(JSON.stringify(body));
  });
};
