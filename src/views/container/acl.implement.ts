import { implement as PMImplement } from 'sunny-foundation/Auth/ACL/PermissionManager';
//@ts-ignore
import { implement as ACImplement } from 'sunny-foundation/Auth/ACL/AccessControl';
import { useRoutes } from 'sunny-foundation/PluggableRouter/transform';

// 集成访问控制
PMImplement({
  // 想让ACL自动从路由配置信息中收集资源resources
  getRoutes() {
    return Object.values(useRoutes());
  },
});
ACImplement({
  getRole() {
    return 'guest';
  },
});
