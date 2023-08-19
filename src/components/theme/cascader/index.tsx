import React from 'react';
import { Cascader } from 'antd';
import './style.scss';

export default ({ className = '', popupClassName = '', ...props }) => (
  <Cascader
    className={`themeComponent ${className}`}
    popupClassName={`themeComponent ${popupClassName}`}
    {...props}
  />
);
