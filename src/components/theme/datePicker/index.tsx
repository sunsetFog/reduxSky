import React from 'react';
import { DatePicker } from 'antd';
import './style.scss';

const ThemeDatePicker = ({ className = '', dropdownClassName = '', ...props }) => (
  <DatePicker
    className={`themeComponent ${className}`}
    dropdownClassName={`themeComponent ${dropdownClassName}`}
    {...props}
  />
);

const RangePicker = ({ className = '', dropdownClassName = '', ...props }) => (
  <DatePicker.RangePicker
    className={`themeComponent ${className}`}
    dropdownClassName={`themeComponent ${dropdownClassName}`}
    {...props}
  />
);

const MonthPicker = ({ className = '', dropdownClassName = '', ...props }) => (
  <DatePicker.MonthPicker
    className={`themeComponent ${className}`}
    dropdownClassName={`themeComponent ${dropdownClassName}`}
    {...props}
  />
);

ThemeDatePicker.RangePicker = RangePicker;
ThemeDatePicker.MonthPicker = MonthPicker;
export default ThemeDatePicker;
