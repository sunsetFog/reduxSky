// components
// import { hide, show } from '@/components/loading';
import BasicService, { BindActionInterface } from './basicService';

export * from './basicService';

export interface GetActionInterface {
  bindLoading?: string; // 绑定loading
  type?: string; // 调用type
  action?: string; // 调用action
  isLoadingOpen?: boolean; // 不关闭loading状态
  sendingData?: any; // 发送的数据
}

export const loadingType = {
  global: 'global', // 全局
  loading: 'loading', // 默认单个为loading
};

export const bindType = {
  all: 'all', // 一起请求
};

class LoadingService extends BasicService {
  public state = {};

  public bindAllAction = ({
    api = {},
    action = api.toString(), // https://github.com/webpack/webpack/issues/8132 name在生产环境, 可能出现重复名称
    type = bindType.all,
    ...restProps
  }: BindActionInterface) => {
    this.bindAction({
      api,
      action,
      type,
      ...restProps,
    });
  };
  // 请求数据, 多个一起
  public getAll = ({
    bindLoading = loadingType.global,
    type = bindType.all,
    isLoadingOpen = false,
    ...restProps
  }: GetActionInterface = {}): any => {
    this.$_handleRequestLoading({ bindLoading });
    return this.$_doAction({ type }, restProps)
      .catch((err) => {
        this.$_handleResponseLoading({ bindLoading, isLoadingOpen: false });
        return Promise.reject(err);
      })
      .finally(() => {
        this.$_handleResponseLoading({ bindLoading, isLoadingOpen });
      });
  };
  // 请求数据, 读取单个
  public getSingle = ({
    bindLoading = loadingType.loading,
    action = '',
    isLoadingOpen = false,
    ...restProps
  }: GetActionInterface = {}): any => {
    this.$_handleRequestLoading({ bindLoading });
    return this.$_doAction({ action }, restProps)
      .catch((err) => {
        this.$_handleResponseLoading({ bindLoading, isLoadingOpen: false });
        return Promise.reject(err);
      })
      .finally(() => {
        this.$_handleResponseLoading({ bindLoading, isLoadingOpen });
      });
  };

  // 打开loading资源
  private $_handleRequestLoading = ({ bindLoading }) => {
    if (bindLoading === loadingType.global) {
      // show();
    } else if (bindLoading) {
      this.isMounted &&
        this.setState({
          [bindLoading]: true,
        });
    }
  };
  // 关闭loading资源
  private $_handleResponseLoading = ({ bindLoading, isLoadingOpen }) => {
    if (isLoadingOpen) {
      return;
    }
    if (bindLoading === loadingType.global) {
      // hide();
    } else if (bindLoading) {
      this.isMounted &&
        this.setState({
          [bindLoading]: false,
        });
    }
  };
}

export default LoadingService;
