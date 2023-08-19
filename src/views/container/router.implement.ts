// @ts-nocheck
// import { Loading } from '@/components/loading';

import { implement as ScannerImplement } from 'sunny-foundation/PluggableRouter/viewScanner';

/**
 * 兼容react hot loader/babel代码注入逻辑，使能够正常热更新
 * require.context必须在module context下使用，不可以放在function context下
 */
const req = require.context('../', true, /(\w+View\/index|\/route)\.[a-z]+$/i);

/**
 * 实现PluggableRouter部分公开接口
 */

/**
 * 使用自定义loading组件
 */
// useCustomLoading(Loading);

// 定义扫描规则
ScannerImplement({
  scanModules: () => req,
});
