const currentPlatform = process.env.platform || 'bob';
const platformConf = {
  bob: {
    apiTarget: 'http://agent-admin-all.fgry45iy.com',
    port: 8891,
    name: 'BOB',
    fullName: '半岛体育',
  },
  tb: {
    // apiTarget: 'http://agent-admin-all.fgry45iy.com', // 测试
    apiTarget: 'http://agentadmin.ssgonna.com',
    port: 8892,
    name: '天博',
    fullName: '天博体育',
  },
  nb: {
    apiTarget: 'http://agent-admin-all.hnkdpt.com/',
    port: 8893,
    name: '牛宝',
    fullName: '牛宝体育',
  },
  tt: {
    apiTarget: 'http://bwbagent.hnkdpt.com',
    port: 8894,
    name: '天天',
    fullName: '天天游戏',
  },
};
exports.currentPlatform = currentPlatform;
exports.platformConf = platformConf;
exports.currentPlatformConf = platformConf[currentPlatform];
