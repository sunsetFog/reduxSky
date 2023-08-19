// import { clearUserInfo } from '@/views/user/userRDM/helper';
import moment from 'moment';

export const platform = process.env.platform;
export const isBob = platform === 'bob';
export const isTb = platform === 'tb';
export const isBW = platform !== 'bob' && platform !== 'tb';
export const isWidth400 = window.screen.width > 600;
export function isJudge(value) {
  return (trued, falsed) => {
    if (value) {
      return trued;
    } else {
      return falsed;
    }
  };
}

/**
 * @param  {string} ...className
 * 解构react的className数组
 */
export function reactClassNameJoin(...className) {
  return className.join(' ');
}

/**
 * 格式化时间
 * @param {string} format 格式
 * @param {Date() | timestamp} format 时间
 */
export function formatTime(time = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(time).format(format);
}

/**
 * 金额保留两位小数
 * @param {string} format 金额
 */
export const formatMoney = (value) => {
  if (!+value) {
    return '0.00';
  }
  return (+value).toFixed(2).toString();
};

/**
 * 根据类型显示名称
 * @param {string} format 金额
 */
export const getLabelFromValue = (value, options) => {
  try {
    return options.find((item) => String(item.value) === String(value)).label;
  } catch (error) {
    return '';
  }
};

// 将string转为number
function stringToNumber(data) {
  if (typeof data !== 'string') {
    return data;
  }
  const res = Number(data);
  return Number.isNaN(res) ? data : res;
}
export function toNumber(data) {
  if (Array.isArray(data)) {
    if (!data.length) {
      return data;
    }
    return data.map((item) => stringToNumber(item));
  }
  return stringToNumber(data);
}
export function toString(data) {
  if (Array.isArray(data)) {
    if (!data.length) {
      return data;
    }
    return data.map((item) => String(item));
  }
  return String(data);
}

/**
 * 下载文件流
 * @param {*} blob
 * @param {*} fileName
 */
export function downLoadFile(blob, fileName) {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(blob); //创建一个指向该参数对象的URL
  link.download = fileName;
  link.click(); // 触发下载
  URL.revokeObjectURL(link.href); // 释放通过 URL.createObjectURL() 创建的 URL
}

export function delay(time = 1000) {
  return new Promise((resolve) => setTimeout(() => resolve(time), time));
}

//生成唯一id
export const getUuid = () => {
  let s = [];
  let hexDigits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  let uuid = s.join('');
  return uuid;
};

export const clearCacheLoginInfo = (key: string) => {
  //生成页面唯一凭证,本地持久化(lcoalstorage)+redux(目的：标记当前页面id)
  if (!sessionStorage.getItem(key)) {
    const unique_id = getUuid();
    localStorage.setItem(`${key}${unique_id}`, '1');
    sessionStorage.setItem(key, unique_id);
  }
  let beforeUnload_time = 0,
    gap_time = 0;
  // var is_fireFox = navigator.userAgent.indexOf('Firefox') > -1 //是否是火狐浏览器 火狐中这一套方案并不生效，但无影响
  window.addEventListener('beforeunload', () => {
    beforeUnload_time = new Date().getTime();
  });
  window.addEventListener('unload', () => {
    gap_time = new Date().getTime() - beforeUnload_time;
    if (
      sessionStorage.getItem(key) &&
      localStorage.getItem(`${key}${sessionStorage.getItem(key)}`)
    ) {
      if (gap_time <= 5) {
        //关闭
        localStorage.removeItem(`${key}${sessionStorage.getItem(key)}`);
      }
    }
    const arrayOfKeys = Object.keys(localStorage).filter((e) => {
      return e.indexOf(key) !== -1;
    });
    if (gap_time <= 5) {
      //关闭
      if (!arrayOfKeys.length) {
        console.log('清除用户信息');

        // clearUserInfo();
      }
    }
  });
};

/**
 * 替换敏感词 仅以bob开头的才替换（中间的不替换），不区分大小写 如：Bobvip1隐藏为vip1，abobobvip1不隐藏
 * 注：如有其他需求，请重写一个方法，不要修改这个方法
 * @param {string} sourceStr 原字符串
 * @param {string} replacementPairs 需要替换的敏感词 默认bob
 * @param {string} resultPairs 替换成的词 默认''
 * @return {string} 替换后的字符串
 */
export const replaceSensitiveStr = (
  sourceStr,
  replacementPairs: string = 'bob',
  resultPairs: string = '',
) => {
  // sourceStr = 'Bob123456'
  // resultPairs = '***'
  if (process.env.platform.toLowerCase() !== 'bob') {
    return sourceStr;
  }
  if (!sourceStr) {
    return '';
  }
  const reg = '^' + replacementPairs;
  return sourceStr.replace(RegExp(reg, 'i'), resultPairs);
};

export const replaceAllStr = (
  sourceStr: any,
  replacementPairs: string = 'bob',
  resultPairs: string = '半岛',
) => {
  if (!sourceStr) {
    return '';
  }
  return sourceStr.replace(RegExp(replacementPairs, 'ig'), resultPairs);
};
