import React from 'react';
import { Input } from 'antd';
import './style.scss';

export default ({ className = '', ...props }) => (
  <Input.TextArea className={`themeComponent ${className}`} {...props} />
);
