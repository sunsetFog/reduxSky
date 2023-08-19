import { message } from 'antd';
import React from 'react';
import { isObservable } from 'rxjs';

export interface BindActionInterface {
  api: any; // api请求
  action?: string; // 给doAction使用
  type?: string; // 提供getAll 遍历一起使用
  hasPrivilege?: boolean; // 是否有权限
  sendingDataFunc?: (result?) => any; // 发送的数据函数, 处理绑定state在componentDidMount, 下次调用无法获取最新数据
  sendingData?: any; // 发送的数据, componentDidMount发送不绑定state更改的值， 或者调取getAll/getSingle时候使用
  formatBindingData?: (result, sendingData?) => any; // 格式化绑定在state的值
  bindingData?: string; // 绑定在state的值
  polling?: number; // 当前接口轮询时间
  successCallback?: (data, ...restProps) => any; // 成功回调
  failCallback?: (data, ...restProps) => any; // 失败回调
}

export interface ContainerPropsInterface {
  [random: string]: any;
}

export interface ContainerStateInterface {
  [random: string]: any;
}

class BasicService extends React.PureComponent<ContainerPropsInterface, ContainerStateInterface> {
  public state = {};

  public $_isMounted = true; // 已经进入，还未离开
  public get isMounted() {
    return this.$_isMounted;
  }
  public set isMounted(status: boolean) {
    this.$_isMounted = status;
  }

  private apiList = []; // api列表
  private pollingApiList = []; // 轮询api列表
  public $_getBindList = ({ action = '', type = '' } = {}) => {
    return this.apiList.filter(
      (item) => (item.action === action && action) || (item.type === type && type),
    );
  };

  // 绑定基础方法
  public bindAction = ({
    api = {},
    action = api.toString(), // https://github.com/webpack/webpack/issues/8132 name在生产环境, 可能出现重复名称
    type = '',
    hasPrivilege = true,
    sendingDataFunc = (v) => v || {},
    sendingData = {},
    formatBindingData = (v) => v,
    bindingData = '',
    polling = 0,
    successCallback,
    failCallback,
  }: BindActionInterface) => {
    hasPrivilege &&
      this.apiList.push({
        api,
        action,
        type,
        sendingDataFunc,
        sendingData,
        formatBindingData,
        bindingData,
        polling,
        successCallback,
        failCallback,
      });
  };

  /** 执行单一请求
   * { action = '', type = '' } 调用
   * restProps 覆盖bindAction参数
   */
  public $_doAction = ({ action = '', type = '' } = {}, restProps = {}) => {
    const bindList = this.$_getBindList({ action, type });
    if (!(Array.isArray(bindList) && bindList.length)) {
      return Promise.reject('你无权限访问此action');
    }
    return this.$_handleCommand(bindList, restProps);
  };

  /** 执行单一请求
   * bindList 绑定的api list
   * restProps 覆盖bindAction参数
   */
  public $_handleCommand = async (bindList, restProps = {}) => {
    try {
      const bindPromise = bindList.map((item) => {
        const resItem = { ...item, ...restProps };
        if (resItem.polling) {
          this.pollingApiList.push(
            setInterval(() => {
              this.$_handleRequest(resItem);
            }, resItem.polling),
          );
        }
        return this.$_handleRequest(resItem);
      });

      return Promise.all(bindPromise);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  public $_handleRequest = async ({
    api,
    sendingDataFunc,
    sendingData,
    formatBindingData,
    bindingData,
    successCallback,
    failCallback,
  }) => {
    const sendingMap = Object.assign(sendingDataFunc(), sendingData);
    try {
      const apiResult = await api(sendingMap);
      // 如果返回为rxjs, 转为Promise，并得到其返回值
      const result = isObservable(apiResult) ? await apiResult.toPromise() : await apiResult;
      // 申请接口不需要绑定值
      if (bindingData) {
        this.isMounted &&
          this.setState({
            [bindingData]: formatBindingData(result.data, sendingMap),
          });
      }
      if (typeof successCallback === 'function') {
        successCallback(result, sendingMap);
      }
      return Promise.resolve(result);
    } catch (e) {
      if (typeof failCallback === 'function') {
        failCallback(e, sendingMap);
      } else {
        if (e.code !== 6032) {
          message.error(e.message);
        }
      }
      return Promise.reject(e);
    }
  };

  // 清空定时器
  public clearPollingApiList = () => {
    this.pollingApiList.forEach((item) => {
      clearInterval(item);
    });
    this.pollingApiList = [];
  };

  public componentWillUnmount() {
    this.isMounted = false;
    this.apiList = [];
    this.clearPollingApiList();
  }
}

export default BasicService;
