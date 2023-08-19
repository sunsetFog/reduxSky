import React, { ErrorInfo, FC, PureComponent } from 'react';
import BusinessError from '../library/request/businessError';
import ConnectionError from '../library/request/connectionError';
import requestChannel from '../library/request/channel';
import AjaxCancelError from 'sunny-js/request/AjaxCancelError';
import { Button, Result } from 'antd';
import { Subscription } from 'rxjs';

const ErrorResult: FC<{
  error: any;
  errorInfo: ErrorInfo;
}> = ({ error, errorInfo }) => {
  return (
    <Result
      status='error'
      title='当前页面操作发生了错误'
      extra={[
        <Button key='buy' href={'/home/homeView'}>
          回到主页
        </Button>,
        <Button type='primary' key='console' onClick={() => location.reload()}>
          刷新页面
        </Button>,
      ]}
    >
      <details style={{ whiteSpace: 'pre-wrap' }}>
        <summary style={{ textAlign: 'center' }}>查看详细错误内容</summary>
        {error && error.toString()}
        {errorInfo.componentStack}
      </details>
    </Result>
  );
};

export default class ErrorBoundary extends PureComponent<
  {},
  {
    error: any;
    errorInfo: ErrorInfo;
  }
> {
  private _requestErrorSubscription$: Subscription;
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidMount() {
    this._requestErrorSubscription$ = requestChannel.subscribe(({ payload: error }) =>
      this.errorHandler(error),
    );
  }

  componentWillUnmount() {
    this._requestErrorSubscription$.unsubscribe();
  }

  /**
   * 处理请求异常事件
   * @param {BusinessError|ConnectionError} error
   */
  errorHandler = (error) => {
    console.debug(this.constructor.name, '在这里处理公共异常交互', error);
    switch (error.constructor.name) {
      // @ts-ignore
      case BusinessError.name:
        // 处理公共业务异常
        break;
      case ConnectionError.name:
        // 处理公共连接异常
        break;
      case AjaxCancelError.name:
        // 处理请求被取消
        break;
    }
  };

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // console.error(this.constructor.name, error, info)
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // You can render any custom fallback UI
      return <ErrorResult error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}
