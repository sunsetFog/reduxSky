import React from 'react';
import { Tabs } from 'antd';
import './style.scss';

const tabs = ({ className = '', ...props }) => (
  <Tabs className={`themeComponent ${className}`} {...props} />
);

tabs.TabPane = Tabs.TabPane;

export default tabs;
