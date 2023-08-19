import { propBy } from 'sunny-js/util/object';
import store from '@/views/container/store';
import { CLEAR, UPDATE_TOKEN, updateUserInfoAction } from './userActions';
import { actionCreator } from '@/utils/redux.helper';
import {
  UPDATE_MESSAGE_COUNT,
  UPDATE_BULLETIN_COUNT,
  UPDATE_CONTACTS,
  IS_SHOW,
  UPDATE_SETPAYPASSWORDINFO,
} from '@/views/container/appRDM/appActions';
import { isEmpty } from 'lodash';

export function userInfo() {
  return propBy('user', store.getState()) || {};
}

export function hasUserInfo() {
  return !!userInfo().id;
}

export function hasPublicSource() {
  return !!userInfo().userSource;
}

export function token(): string {
  // console.debug('store state', store.getState());
  return userInfo().token;
}

export function isLogin() {
  return !!token();
}

export function clearUserInfo() {
  store.dispatch(actionCreator(CLEAR));
}

export function updateUserInfo(data) {
  // 更新用户信息
  store.dispatch(updateUserInfoAction(data));
}

export function updateUserSource(data) {
  store.dispatch(updateUserInfoAction({ userSource: data }));
  store.dispatch({ type: UPDATE_MESSAGE_COUNT, payload: data.msg });
  store.dispatch({ type: UPDATE_BULLETIN_COUNT, payload: data.unReadBulletinCount });
  store.dispatch({ type: IS_SHOW, payload: false });
}

export function updateToken(userToken: string) {
  store.dispatch(actionCreator(UPDATE_TOKEN, userToken));
}

export function hasLiveChat() {
  return !!(store.getState() as any).app.contacts.length;
}

export function updateLiveChat(data) {
  store.dispatch({ type: UPDATE_CONTACTS, payload: data.result });
}

export function hasSetPayPasswordInfo() {
  return !isEmpty((store.getState() as any).app.setPayPasswordInfo);
}

export function updateSetPayPasswordInfo(data) {
  store.dispatch({ type: UPDATE_SETPAYPASSWORDINFO, payload: data });
}
