import React from 'react';
import LoadingService from './loadingService';

export * from './loadingService';

// 基础table数据类型
export const initFormData = {
  isVisible: false, // 是否显示弹框
  loading: false, // 是否显示弹出loading
} as any;

/*** 为form新增/编辑 提供公共方法和基础服务
 * */
class FormService extends LoadingService {
  public state = {};

  // 编辑表单
  public modalFormRef = React.createRef() as any;

  // 获取表单数据
  public getModalForm = () => {
    return this.modalFormRef.current ? this.modalFormRef.current.getFieldsValue() : {};
  };

  // 需要重写请求方法
  //@ts-ignore
  public onSubmit = (sendingData = {}) => null;

  // 检查表单
  public onValidateForm = () => {
    this.modalFormRef.current.validateFields().then((form) => {
      this.onSubmit(form);
    });
  };

  // 获取是否为编辑状态
  public getIsEdit = (): any => {
    const {
      props: { data, ...restProps },
    } = this;
    return {
      ...restProps,
      isEdit: data && Object.keys(data).length,
      data,
    };
  };

  // 打开弹框
  public onOpenModal = async () => {
    return this.setState({ isVisible: true });
  };

  // 关闭弹框
  public onCloseModal = async () => {
    this.props.handleClose && this.props.handleClose();
    return this.setState({ isVisible: false });
  };

  // 重置数据
  public onRest = () => {
    if (this.modalFormRef.current) {
      this.modalFormRef.current.resetFields();
    }
    this.onCloseModal();
    // 默认关闭弹框的回调
    this.props.handleGetData && this.props.handleGetData();
  };
}

export default FormService;
