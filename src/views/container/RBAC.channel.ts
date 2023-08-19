import { listen, send } from './channel';

// 侧栏菜单有更新
export function menuUpdated() {
  return send(menuUpdated.name);
}

export function onMenuUpdated(cb) {
  return listen(menuUpdated.name, cb, cb + onMenuUpdated.name);
}

// 权限更新了
export function privilegeUpdated() {
  return send(privilegeUpdated.name);
}

export function onPrivilegeUpdated(cb) {
  return listen(privilegeUpdated.name, cb, cb + onPrivilegeUpdated.name);
}
