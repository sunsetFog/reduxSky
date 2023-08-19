import { render } from 'react-dom';

const ua = navigator.userAgent;

// 是否为mac系统
export const isMac = () => /macintosh|mac os x/i.test(ua);

// 是否为windows系统
export const isWindows = () => /windows|win32/i.test(ua);

// 获取滚动条宽度
export function getScrollBarWidth() {
  const el = document.createElement('div');
  // 设置style
  el.style.width = '100px';
  el.style.height = '100px';
  // 插入文档
  document.body.appendChild(el);
  // 获取未加入滚动轴的clientWidth
  const clientWidth1 = el.clientWidth;
  // 设置滚动轴属性
  el.style.overflowY = 'scroll';
  // 获取加入滚动轴的clientWidth
  const clientWidth2 = el.clientWidth;
  // 获取滚动轴宽度
  const scrollBarWidth = clientWidth1 - clientWidth2;
  // 移除元素兼容IE
  document.body.removeChild(el);
  // 移除元素不兼容IE
  el.remove();
  return scrollBarWidth;
}

// 获取文字宽度 -> 默认字体为table样式 14px
export function getTextWith(
  text = '',
  fontStyle = '14px/1.5715 "Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif"',
) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = fontStyle;
  // console.log('@context-font', parseInt(context.font, 10))
  const elem = context.measureText(text);
  return elem.width;
}

/* 获取react元素的文本
 * 备选方案 react-innertext https://github.com/CharlesStover/react-innertext
 * 获取当前节点children元素
 * */
export function getReactNodeInnerText(node): any {
  return new Promise(async (resolve) => {
    const elem = document.createElement('span');
    // 等待render成功
    await render(node, elem);
    resolve(elem.innerText);
  });
}

/*
 * 判断客户端是否为PC还是手持移动设备
 * return true 移动端 falase pc端
 */
export const isMoblie = () =>
  ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'].some((item) =>
    navigator.userAgent.includes(item),
  );
