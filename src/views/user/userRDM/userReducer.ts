import produce from 'immer';
import { UPDATE_USER_INFO, CLEAR, UPDATE_TOKEN } from './userActions';
import { loadFromStorage, saveToLocal } from 'sunny-js/util/storage';

const cacheKey = 'userInfo';
const cacheKeyTime = 'member_duration';
const userReducer = produce((draft, action) => {
  switch (action.type) {
    case UPDATE_USER_INFO: {
      Object.assign(draft, action.payload);
      break;
    }
    case UPDATE_TOKEN:
      saveToLocal({ [cacheKey]: Object.assign(draft, action.payload) });
      break;
    case CLEAR:
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(cacheKeyTime);
      return {}; // clear
  }
}, loadFromStorage(cacheKey) || {});

export default userReducer;
