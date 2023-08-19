import React, { forwardRef } from 'react';
import { Form } from 'antd';
import './style.scss';

const ThemeForm = forwardRef((props, ref) => {
  const { className, ...remaining } = props as any;
  return <Form className={`themeComponent ${className}`} {...remaining} ref={ref} />;
}) as any;

ThemeForm.Item = Form.Item;
ThemeForm.List = Form.List;

export default ThemeForm;
