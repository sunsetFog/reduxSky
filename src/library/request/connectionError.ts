import { ConnectionError } from 'sunny-js/request/ConnectionError';

/**
 * 自定义ConnectionError实例message属性取值逻辑
 * 不同的网络请求库，对message对输出形式各不相同
 * EnhanceMessage方法提供定制ConnectionError实例属性message内容的能力
 */
// ConnectionError.EnhanceMessage = () => {}
export default ConnectionError;
