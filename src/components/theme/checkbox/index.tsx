import React from 'react';
import { Checkbox } from 'antd';
import Group from './group';
import './style.scss';

const ThemeCheckBox = ({ className = '', ...props }) => (
  <Checkbox className={`themeComponent ${className}`} {...props} />
);

ThemeCheckBox.Group = Group;

export default ThemeCheckBox;
