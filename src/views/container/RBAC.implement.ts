import { clearCache, implement } from 'sunny-foundation/AccessControl/RBAC/PermissionsManager';
import { onLogout, onRequestLogin } from 'sunny-foundation/Auth/channel';
import { onSessionError } from '../../library/request/channel';
import { onPrivilegeUpdated } from './RBAC.channel';

implement({
  ajaxResources() {
    return Promise.resolve([]);
  },
  ajaxPrivileges({}) {
    return Promise.resolve([]);
  },
});

// 权限信息更新时，清空现有缓存，可以触发重新请求权限数据
onPrivilegeUpdated(clearCache);
onRequestLogin(clearCache);
onSessionError(clearCache);
onLogout(clearCache);
