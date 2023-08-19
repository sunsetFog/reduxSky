module.exports = {
  presets: [
    ['@babel/preset-env', { targets: 'defaults' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    /**
     * 新版本可以在@babel/preset-env中配置使用core js和helper等特性
     *
     * 解决问题 Babel is injecting helpers into each file and bloating my code!
     * see https://github.com/babel/babel-loader#babel-is-injecting-helpers-into-each-file-and-bloating-my-code
     * 如果代码量多，将inline模式插入的helper代码改成以module形式从@babel/runtime包引入还是比较划算的
     * 可以根据启用和不启用两次的编译后的bundle大小进行比较，再决定是否使用
     * 如果不决定使用可以执行以下命令删除相关npm包
     * npm un @babel/plugin-transform-runtime @babel/runtime
     * 如果决定使用则需要安装
     * npm i @babel/plugin-transform-runtime @babel/runtime
     */
    // '@babel/plugin-transform-runtime'

    /**
     * 支持使用import() see https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html
     * Note: @babel/preset-env v7.5.0 已经开始内置支持import() https://github.com/babel/babel/pull/10109
     */
    // '@babel/plugin-syntax-dynamic-import',

    /**
     * 转换 async/await 为 promise chain
     * https://github.com/rpetrich/babel-plugin-transform-async-to-promises
     */
    'babel-plugin-transform-async-to-promises',

    // 支持 export * as namespace 语法 https://babeljs.io/docs/en/next/babel-plugin-proposal-export-namespace-from.html
    '@babel/plugin-proposal-export-namespace-from',
    /**
     * 启用 decorators https://mobx.js.org/best/decorators.html#enabling-decorator-syntax
     * make sure that @babel/plugin-proposal-decorators comes before @babel/plugin-proposal-class-properties.
     * Note that the legacy mode is important (as is putting the decorators proposal first). Non-legacy mode is WIP.
     * NOTE: Compatibility with @babel/plugin-proposal-class-properties
     * https://babeljs.io/docs/en/babel-plugin-proposal-decorators#note-compatibility-with-babel-plugin-proposal-class-properties
     */
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    // 支持定义类静态属性属性语法
    // https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html
    // ['@babel/plugin-proposal-class-properties', { loose: true }],
    // 支持类定义私有字段和方法。目前babel-eslint 10还没能很好支持
    // ['@babel/plugin-proposal-private-methods', { 'loose': true }]
    // 按需加载UI组件库 https://github.com/ant-design/babel-plugin-import#options
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, // `style: true` 会加载 less 文件
      },
    ],
    // ['import', {
    //   libraryName: 'antd-mobile',
    //   style: true
    // }, 'antd-mobile'],
    // for ant-design-pro
    // ['import', {
    //   libraryName: 'ant-design-pro',
    //   style: true,
    //   camel2DashComponentName: false
    // }, 'ant-design-pro'],
    /**
     * for antd pro layout
     * 请使用具体路径引用BasicLayout路径引用其子组件
     */
    // ['import', {
    //   libraryName: '@ant-design/pro-layout',
    //   libraryDirectory: 'es',
    //   style: false,
    //   // style: true,
    //   camel2DashComponentName: false
    // }, 'ant-design-pro-layout'],
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false, // default: true
      },
      'lodash',
    ],

    /**
     * 启用react hot loader https://github.com/pmmmwh/react-refresh-webpack-plugin/
     * @see https://github.com/gaearon/react-hot-loader#code-splitting 异步组件出现无法热更新的问题
     */
    process.env.NODE_ENV === 'development' ? require.resolve('react-refresh/babel') : [{}],
    /**
     * 为react组件的异常信息调用堆栈添加文件名和行数信息
     * Component Stack Traces https://reactjs.org/docs/error-boundaries.html#component-stack-traces
     * 对应babel插件 @babel/plugin-transform-react-jsx-source https://babeljs.io/docs/en/next/babel-plugin-transform-react-jsx-source.html
     */
  ],
};
