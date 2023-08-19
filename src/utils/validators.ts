import { isBW } from './helpers';
export const getpattern = {
  // 验证码：数字，6位
  sms: /^\d{6}$/,
  // 英文名：字母+空格，2到15位
  // name: /^[A-Za-z0-9]{4,13}$/,
  name: isBW ? /^[A-Za-z.@0-9]{6,10}$/ : /^[A-Za-z.@0-9]{6,16}$/,
  realName: /^[\u4e00-\u9fa5]{2,4}$/,
  // 允许注册的手机号码： 中国(86-13800138000)，菲律宾(63-9454561234)
  phone: /^1[0-9]{10}$/,
  // 密码：不能为纯数字或纯字母，8~20位
  password: /^[A-Za-z0-9]{6,16}$/,
  // 1 首位不能是0  ^[1-9], 2 必须是 [5, 11] 位的数字  \d{4, 9}
  qq: /^[1-9][0-9]{4,9}$/gim,
  email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
};
export const antdFormValidators = {
  sms(_, value) {
    if (!value) {
      return Promise.reject('验证码不能为空');
    } else if (value && !new RegExp(getpattern.sms).test(value)) {
      return Promise.reject('验证码错误');
    } else {
      return Promise.resolve();
    }
  },
  name(_, value) {
    if (!value) {
      return Promise.reject('用户名不能为空');
    } else if (!new RegExp(getpattern.name).test(value) || /^\d+$/.test(value)) {
      return Promise.reject(`请使用字母+数字组合设置用户名，长度6-${isBW ? '10' : '16'}位`);
    } else {
      return Promise.resolve();
    }
  },
  realName(_, value) {
    if (!value) {
      return Promise.reject('真实姓名不能为空');
    } else if (value && !new RegExp(getpattern.realName).test(value)) {
      return Promise.reject('真实姓名填写有误');
    } else {
      return Promise.resolve();
    }
  },
  phone(_, value) {
    if (!value) {
      return Promise.reject('手机号不能为空');
    } else if (value && !new RegExp(getpattern.phone).test(value)) {
      return Promise.reject('手机号格式不正确');
    } else {
      return Promise.resolve();
    }
  },
  password(_, value) {
    if (!value) {
      return Promise.reject('密码不能为空');
    } else if (value && !new RegExp(getpattern.password).test(value)) {
      return Promise.reject('请使用字母或数字设置登录密码，长度6-16位');
    } else {
      return Promise.resolve();
    }
  },
  qq(_, value) {
    if (!value) {
      return Promise.reject('QQ不能为空');
    } else if (value && !new RegExp(getpattern.qq).test(value)) {
      return Promise.reject('请输入正确的QQ号码');
    } else {
      return Promise.resolve();
    }
  },
  email(_, value) {
    if (!value) {
      return Promise.reject('email不能为空');
    } else if (value && !new RegExp(getpattern.email).test(value)) {
      return Promise.reject('请输入正确的email');
    } else {
      if (value.indexOf('@qq') !== -1) {
        return Promise.reject('不能输入qq邮箱');
      }
      return Promise.resolve();
    }
  },
  /**
   * 比较两次输入的密码是否一致
   * @param firstPassword 第一次输入的密码
   * @param curPassword 当前输入的密码
   * @param callback 回调
   */
  compareToFirstPassword(firstPassword, curPassword) {
    if (curPassword && curPassword !== firstPassword) {
      return Promise.reject('两次输入的密码不一致');
    } else {
      return Promise.resolve();
    }
  },
};
