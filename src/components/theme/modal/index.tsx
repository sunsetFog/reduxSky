import React from 'react';
import { Modal } from 'antd';
import './style.scss';

const themeModal = ({ wrapClassName = '', ...props }) => (
  <Modal wrapClassName={`themeComponent ${wrapClassName}`} {...props} />
);

const confirm = ({ className = '', ...props }) =>
  Modal.confirm({ className: `themeComponent ${className}`, ...props });

const info = ({ className = '', ...props }) =>
  Modal.info({ className: `themeComponent ${className}`, ...props });

themeModal.confirm = confirm;
themeModal.info = info;

export default themeModal;
