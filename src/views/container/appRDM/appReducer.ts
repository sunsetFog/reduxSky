import produce from 'immer';
import {
  CHANGE_THEME_NAME,
  UPDATE_MESSAGE_COUNT,
  UPDATE_BULLETIN_COUNT,
  UPDATE_CONTACTS,
  IS_SHOW,
  UPDATE_SETPAYPASSWORDINFO,
} from './appActions';
// utils
import themes from '@/utils/theme';

const initState = {
  theme: themes.initTheme(), // 主题色
  unreadCount: 0, //未读消息数
  unBulletinCount: 0, // 未读公告数
  contacts: [], // 在线客服
  isShow: true, // 全局加载
  setPayPasswordInfo: {} as any, // 设置密码详情
};

const appReducer = produce((draft, action) => {
  switch (action.type) {
    case CHANGE_THEME_NAME: {
      Object.assign(draft, {
        theme: themes.setTheme(),
      });
      break;
    }
    case UPDATE_MESSAGE_COUNT: {
      Object.assign(draft, {
        unreadCount: action.payload,
      });
      break;
    }
    case UPDATE_BULLETIN_COUNT: {
      Object.assign(draft, {
        unBulletinCount: action.payload,
      });
      break;
    }
    case UPDATE_CONTACTS: {
      Object.assign(draft, {
        contacts: action.payload,
      });
      break;
    }
    case IS_SHOW: {
      Object.assign(draft, {
        isShow: action.payload,
      });
      break;
    }
    case UPDATE_SETPAYPASSWORDINFO: {
      Object.assign(draft, {
        setPayPasswordInfo: action.payload,
      });
      break;
    }
  }
}, initState);

export default appReducer;
