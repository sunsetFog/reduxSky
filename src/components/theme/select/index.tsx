import React from 'react';
import { Select } from 'antd';
import './style.scss';

const ThemeSelect = ({ className = '', dropdownClassName = '', ...props }) => (
  <Select
    className={`themeComponent ${className}`}
    dropdownClassName={`themeComponent ${dropdownClassName}`}
    {...props}
  />
);

ThemeSelect.Option = Select.Option;

export default ThemeSelect;
