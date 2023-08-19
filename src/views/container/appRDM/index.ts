import appReducer from './appReducer';

/**
 * 全局信息
 * RDM 表示redux dynamic module
 */
export default function appRDM() {
  return {
    id: 'app-rdm',
    reducerMap: {
      app: appReducer,
    },
  };
}
