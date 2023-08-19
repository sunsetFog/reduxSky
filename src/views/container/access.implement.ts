import { implement as AuthImplement } from 'sunny-foundation/Auth';
import { blockVisitor } from 'sunny-foundation/Auth/channel';
// import {
//   ACLRouteProps,
//   isAllowed
// } from 'sunny-foundation/Auth/ACL/AccessControl'
import {
  getPrivileges,
  getResources,
  hasResource,
} from 'sunny-foundation/AccessControl/RBAC/PermissionsManager';
import { matchPath } from 'react-router';

// noinspection JSUnusedGlobalSymbols
AuthImplement({
  access(routeProps) {
    return Promise.all([
      // 集成ACL模块，进行访问控制
      // isAllowed(route as ACLRouteProps),
      // 准备好RBAC权限控制模块所需的resources资源信息，后面的查询都会用到
      getResources()
        // 准备好RBAC权限控制模块当前resources所需的privileges信息
        .then(() => getPrivileges())
        .then(() => {
          /**
           * 查询当前菜单是否被授权访问
           * 如果/parent被允许，那么/parent/child也被允许
           * 使用matchPath是为了处理route.path为数组的情况
           */
          const match = matchPath(location.pathname, routeProps);
          return (match && hasResource(match.path)) || Promise.reject();
        }),
      // 超级管理员是否不需要使用getResources，getPrivileges接口拉去数据？
      //.catch(err => isRootUser() ? Promise.resolve() : Promise.reject(err)),
    ]);
  },
  blockVisitor,
});
