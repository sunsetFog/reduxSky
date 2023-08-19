import React from 'react';
import { Button } from 'antd';
import './style.scss';

export default ({ className = '', ...props }) => (
  <Button className={`themeComponent ${className}`} {...props} />
);
