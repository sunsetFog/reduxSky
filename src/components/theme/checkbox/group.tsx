import React from 'react';
import { Checkbox } from 'antd';
import './style.scss';

export default ({ className = '', ...props }) => (
  <Checkbox.Group className={`themeComponent ${className}`} {...props} />
);
