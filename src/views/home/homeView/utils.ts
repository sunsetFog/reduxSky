import moment from 'moment';
// 获取当前组件剩余高度
export const getContentHeight = (el, bottom = 140) => {
  const h = document.body.clientHeight;
  if (el) {
    return h - el.offsetTop - bottom;
  }
  return h;
};
/**
 *
 * @param theme 白天黑夜字段
 * @param all 当月下级人数
 * @param active 活跃人数
 */

export function getFormatter(params, unit) {
  console.log(moment().get('month'), '11111111');
  let htmlStr = '<div style="color: #fff">';
  htmlStr += moment().get('month') + '月' + params[0].axisValue + '<br/>';
  params.forEach((element) => {
    htmlStr += `${element.seriesName} :${element.data}${unit ? '%' : ''}<br/>`;
  });
  return htmlStr;
}
