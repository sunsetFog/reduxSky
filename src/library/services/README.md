# 基础服务方法

// basicService.tsx 是基础方法，一般外部不调用
// loadingService.tsx 封装loading service
// listViewService.tsx 封装listView service

```
$_ 开头为内部私有方法, 不能在继承后调用
```

1. 导入服务
```
 import LoadingService from '@/library/services/loadingService';
```

2. 继承基础服务
```
 class SwitchThemeView extends LoadingService {
 }
```
 
3. 在componentDidMount绑定
```
// bind两种

// 使用bindAction 不被getAll调用
// this.bindAction({ api: getDemo1, bindingData: 'demo1' });
// this.bindAction({ api: getDemo2, bindingData: 'demo2' });

// 使用bindAllAction 可被getAll调用
this.bindAllAction({ api: getDemo1, bindingData: 'demo1' });
this.bindAllAction({ api: getDemo2, bindingData: 'demo2' });
```

4. 调用 --> loading service
```
// 单独调用
// this.getSingle({ action: getDemo1.toString() });
// this.getSingle({ action: getDemo2.toString() });

// 调取全局loading
// this.getAll();

// 调取自定义loading
// this.getAll({ bindLoading: 'myLoading' });

// 串行调用
try {
  const res1 = await this.getSingle({ action: getDemo1.toString(), sendingData: { time: 1111 } });
  const res2 = await this.getSingle({ action: getDemo2.toString(), sendingData: { time: res1[0] } });
  console.log(JSON.stringify({ res1, res2 }));
} catch (e) {
  console.log(e);
}
```

5.继承service 
```
当实现componentWillUnmount，需要调用父级别

Class A extends LoadingService {
  public componentWillUnmount {
    super.componentWillUnmount()
  }
}

```
