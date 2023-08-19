import React from 'react';
import { InputNumber } from 'antd';
import './style.scss';

export default ({ className = '', ...props }) => (
  <InputNumber className={`themeComponent ${className}`} {...props} />
);
