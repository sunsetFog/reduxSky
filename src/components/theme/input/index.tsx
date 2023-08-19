import React from 'react';
import { Input } from 'antd';
import './style.scss';
import TextArea from './textArea';

/**
 * 默认禁止输入空格，可设置autoTrim支持空格输入
 */
const ThemeInput = ({ className = '', onChange = (e) => e, autoTrim = true, ...props }) => (
  <Input
    className={`themeComponent ${className}`}
    onChange={(e) =>
      autoTrim ? onChange((e.target.value || '').trim()) : onChange(e.target.value)
    }
    autoComplete='off'
    {...props}
  />
);

ThemeInput.TextArea = TextArea;

export default ThemeInput;
