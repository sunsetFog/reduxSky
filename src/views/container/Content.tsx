import React from 'react';
import { useRouteComponents } from 'sunny-foundation/PluggableRouter/transform';
import ErrorBoundary from '../../components/errorBoundary';
// 定制路由模块
import './router.implement';
// 启用认证路由
import './auth.implement';
import './auth.story';
// 可选启用ACL访问控制
// import './acl.implement'
// import './acl.story'
// import './RBAC.implement'
// import './access.implement'
// import './access.story'
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import { compose } from 'redux';
import Locale from './Locale';
import './style.scss';

/**
 * Container内容部分
 * @param {object} props
 * @param {*} [props.children]
 */
class Content extends React.PureComponent<any, any> {
  public render() {
    const isShow = this.props.app.isShow;
    return (
      <ErrorBoundary>
        <Locale>
          <Switch>
            {/* <WaterMark content={'1111'}> */}
            {useRouteComponents()}
            {/* </WaterMark> */}
            {/* {children} */}
          </Switch>
        </Locale>
      </ErrorBoundary>
    );
  }
}
export default compose(
  connect((state: any) => ({
    app: state.app,
  })),
)(Content);
