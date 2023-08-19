import React from 'react';
// 汉化antd， moment
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
// 汉化moment
import { locale } from 'moment';
locale('zh-cn');

export default function Locale({ children }) {
  return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
}
