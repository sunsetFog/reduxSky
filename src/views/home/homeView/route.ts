export default {
  key: 'homeView',
  name: '首页',
  path: '/',
  nest: '/layout/home/homeView',
  exact: true,
  content: () => import(/* webpackChunkName: "homeView" */ './view'),
};
