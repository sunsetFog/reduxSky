import React from 'react';
import { Dropdown } from 'antd';
import './style.scss';

export default ({ overlay, overlayClassName = '', ...props }) => (
  <Dropdown overlayClassName={`themeComponent ${overlayClassName}`} overlay={overlay} {...props} />
);
