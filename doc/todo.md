网页加载性能监控lighthouse
编译完成后创建zip包
工程编译性能优化
Bundle分析webpack bundle analyzer
工程编译输出资源大小监控

只对工具函数库和依赖使用typescript，为业务开发提供更友好的代码提示，依然保留JavaScript的灵活性，和团队成员的开发效率

创建项目开发模板
  集成React技术栈，React + Router + Mobx + RxJS
    集成Redux
      使用界限
        组件私有状态组件内部管理，无需使用redux
        父子通信，使用redux emit action
        全局状态，使用redux管理
    [x] 集成RxJS，轻度使用
    [x] 响应式状态管理Mobx
      enforceActions设置store是否可以被随处修改或限定只能在action中修改
    技术调研redux-persist
  请求库选型：axios……
  css module支持或组件级样式书写方案
    styled-component
    react css modules
  响应式图像和图像懒加载方案react-ideal-image
  配置中心插件化
  [X] 路由插件化，路由规则写到各自page文件夹下
    [Magic Comments](https://webpack.js.org/api/module-methods/#magic-comments)
  集成异常处理库，web service接口公共异常，和私有业务异常
  rxjs常用业务场景代码片段
    请求处理
    异步任务处理
  设备检测库选型，够用且小

技术调研
  新项目的技术选型或现有就项目能否平滑过渡到SSR？
    问题关键词：SSR, CSR, dynamic rendering, Prerender, headless chrome, rehydrate
    使用SSR做加载性能优化需要考虑的问题：
      使用SSR，防止CSR重发请求，重建DOM
        React在客户端再次渲染时，是否会影响到SSR，事件是否能够正常绑定？
        [ReactDOM.hydrate](https://reactjs.org/docs/react-dom.html#hydrate)可以配合SSR，对已经存在对HTML markups，only attach event handlers
          在服务端渲染时，在ajax请求库中定义一个拦截器，将请求结果数据作为initial data生成<script>window.initialData[url]=data</script>代码，注入到head中
          在客户端代码执行的时候，使用注入到head > script里定义好到数据，调用ReactDOM.hydrate绑事件
          使用完initial data，及时清理，以免影响由用户交互引发的二次请求
      阻止不参与DOM创建资源请求，加速SSR
      因为SSR是为客户端做预渲染，并不会顾及SPA的事件绑定逻辑，所以需要重新思考事件绑定逻辑
        React事件处理采用的是事件委派[Event delegation in React](https://github.com/facebook/react/issues/13635)
      为SEO保留页面link入口，SPA在使用router时应保留link入口方便bot爬取页面内容
      SSR可能带来2x的访问量增长，更具实际情况考虑是否需要阻止
      SSR非常适合以内容为的页面，如果是web app有很多动态内容只对登录用户可见，则要慎重考虑是否真的需要SSR
    解决方案：
      1. [Puppeteer](https://developers.google.com/web/tools/puppeteer/get-started)，Headless Chrome library
      2. [Rendertron](https://github.com/GoogleChrome/rendertron#installing--deploying)，Headless Chrome rendering solution
      3. [Rendora](https://github.com/rendora/rendora)，reverse HTTP proxy server. dynamic server-side rendering using headless Chrome to effortlessly solve the SEO problem for modern javascript websites
        可能关心的问题：
        1. [What is the difference between Rendora and Puppeteer?](https://github.com/rendora/rendora#what-is-the-difference-between-rendora-and-puppeteer)
        2. [What is the difference between Rendora and Rendertron?](https://github.com/rendora/rendora#what-is-the-difference-between-rendora-and-rendertron)
        核心配置基于agent，paths。Filters based on user agents and paths
      4. [Prerender](https://prerender.io/)，预渲染在线服务平台
    相关文章：
      * [Server side rendering and dynamic rendering with Headless chrome](https://medium.com/@shotap/server-side-rendering-and-dynamic-rendering-with-headless-chrome-f23cdabfae48)
      * [Headless Chrome: an answer to server-side rendering JS sites](https://developers.google.com/web/tools/puppeteer/articles/ssr)
    延申阅读
      [Google Search - Integrate with Search to help grow your business.](https://developers.google.com/search/)
        * [Implement dynamic rendering](https://developers.google.com/search/docs/guides/dynamic-rendering)

React渲染性能优化
* [ ] [why-did-you-update](https://github.com/maicki/why-did-you-update)

常规代办事项
- [x] 集成antd-pro-layout到管理后台启动模板
- [x] 集成Access Control List
- [X] 为切换Router集成转场动效，动效库react-transition-group
- [ ] 满足常规ajax请求Loading交互场景
- [ ] 启用js、dom、bom api兼容性检查，为定制polyfill服务提供参考
- [ ] ~~新框架Demo设计~~
- [x] 在编译时应用可伸缩布局方案px to vw/vh
- [x] 有名字的RDM使用require.context装载成全局RDM
- [x] app.config.js移动到src目录下，如果有则载入，没有则略过
- [x] 尝试修复代码在开发过程中自动热更新不能正常工作的问题
    - react loadable配合react hot loader正常工作的两个条件
      - 模块必须硬编码用es6 import语法声明引用关系，不可使用require.context特性
      - 模块必须硬编码使用loadable包装组件，不可抽象loadable为高阶函数
    - 由于require.context语法打破react-loadable热更新代码注入的逻辑的原因，现尝试思考如下方案：
        1. 生成分布式路由配置引用文件，顺着react-loadable babel插件编译机制解决问题

[其他代办任务](https://www.processon.com/mindmap/5dc2e7a6e4b0ea86c424c7cb)
