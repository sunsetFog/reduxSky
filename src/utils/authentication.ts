/**
 *  鉴权
 * @param {('is_black' | 'allot_power' | 'recharge_power' | 'optPower' | 'offline_power'| 'isMenu')} authority
 */
export default (
  authority:
    | 'is_black'
    | 'allot_power'
    | 'recharge_power'
    | 'opt_power'
    | 'offline_power'
    | 'isMenu'
    | 'offline_activity'
    | 'onLine'
    | 'pay_status',
) => {
  try {
    return JSON.parse(localStorage.userInfo)[authority];
  } catch (error) {
    return false;
  }
};
