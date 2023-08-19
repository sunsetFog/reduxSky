/**
 * webpack configuration exports a function
 * Environment Variables see https://webpack.js.org/guides/environment-variables
 * @param {object} env 为args.env， see https://webpack.js.org/api/cli/#environment-options
 * @param {boolean} env.lint 是否对代码进行lint
 * @param {boolean} env.clean 是否清除缓存
 * @param {boolean} env.analyze
 * @param {Object} args 命令行参数列表
 * @param {boolean} args.open
 * @param {string} args.mode
 * @returns Object
 */
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// 代码混淆包
const WebpackObfuscator = require('webpack-obfuscator');
const LCL = require('last-commit-log');

const lcl = new LCL();

module.exports = async (env = {}, args = {}) => {
  require('./set.process.env')(env, args);
  const gitMes = await lcl.getLastCommit();
  const fs = require('fs');
  const path = require('path');
  const webpack = require('webpack');
  const packageJSON = require('../package.json');
  const { isDev, isPrd, svcEnv } = require('./env');
  const SVC_ENV = svcEnv(args);
  const IS_PRD = isPrd(args.mode);
  const IS_DEV = isDev(args.mode);

  /**
   * APP配置管理
   * 将会把APP配置在编译时传递给应用
   */
  const Config = require('sunny-js/cjs/class/Config').default;
  const appConfigFile = require('./../extend.webpack.config.js');
  let _config = {};
  if (fs.existsSync(appConfigFile)) {
    _config = new Config(appConfigFile).section(SVC_ENV, 'inherit').get();
  }
  const {
    _plugin = [...appConfigFile._plugin],
    _nodeEnv = { ...appConfigFile._nodeEnv },
    _entry = { ...appConfigFile._entry },
    _output = { ...appConfigFile._output },
    _resolve = { ...appConfigFile._resolve },
    _module = { ...appConfigFile._module },
  } = _config;

  // 将被loader处理的源码目录白名单
  const directoryWhiteList = [
    path.resolve('src'),
    // sunny-xxx系列npm包需要加入编译白名单
    /sunny[\w-]+/i,
  ];
  // 插件管理
  const plugins = [..._plugin];

  // 代码混淆包-只有构建时才会用到这个文件不需要区分环境，如果本地编译时也用到需要区分环境加入当前包
  IS_PRD && plugins.push(new WebpackObfuscator({}, []));

  /**
   * 静态资源优化策略
   */
  const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
  const optimization = {
    // doc see https://github.com/webpack-contrib/image-minimizer-webpack-plugin#deleteoriginalassets
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              'imagemin-gifsicle',
              'imagemin-mozjpeg',
              'imagemin-pngquant',
              'imagemin-svgo',
            ],
          },
        },
        loader: false,
      }),
    ],
    // Extracting Boilerplate. See https://webpack.js.org/guides/caching/#extracting-boilerplate
    // 如果是多页应用，可以考虑分离runtime，在多个entry之间共享runtime
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
    usedExports: IS_PRD,
    // Chunk splitting see https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-2
    // Chunk cache see https://webpack.js.org/configuration/optimization/#root
  };
  /**
   * Caching. See https://webpack.js.org/guides/caching/
   * 缓存的hash解决了缓存利用率和覆盖式部署等相关问题
   */
  // web dev server 只能用hash
  const hashType = IS_DEV ? 'hash' : 'contenthash';
  // js、css等静态资源
  const assetsDir = 'static';
  const filenamePattern = `${assetsDir}/[name]${IS_PRD ? `.[${hashType}:16]` : ''}`;
  const chunkFilenamePattern = `${assetsDir}/[name]${IS_PRD ? `.[${hashType}:16]` : ''}.chunk`;
  // 图像、字体等静态资源
  const assetFilenamePattern = `${assetsDir}/[name]${IS_PRD ? '.[hash:16]' : ''}`;
  // css module localIdentName
  const cssModuleLocalIdentName = IS_DEV
    ? '[path][name]__[local]--[hash:base64:5]'
    : '[hash:base64]';
  // 避免chunk里的module ID因某个module更新ID发生连锁变化反应，导致缓存全部失效
  // Module Identifiers. See https://webpack.js.org/guides/caching/#module-identifiers
  IS_PRD && plugins.push(new webpack.ids.HashedModuleIdsPlugin());

  // output configuration
  const output = {
    clean: IS_PRD,
    path: path.resolve('dist'),
    filename: `${filenamePattern}.js`,
    // Note the use of chunkFilename, which determines the name of non-entry chunk files.
    // https://webpack.js.org/configuration/output/#output-chunkfilename
    chunkFilename: `${chunkFilenamePattern}.js`,
    publicPath: '/',
  };

  /**
   * babel compiler configuration
   */
  const javascriptCompiler = {
    loader: 'babel-loader',
    options: {
      // presets: [['@babel/preset-env', { targets: 'defaults' }]],
      // plugins: ['@babel/plugin-proposal-class-properties'],
      // see https://github.com/babel/babel-loader#options
      // 缓存babel编译结果，加快下次编译速度
      cacheDirectory: !env.clean,
      // 缓存时是否压缩缓存。如果编译的文件非常多，不压缩虽然能提升编译性能，但是增加了磁盘空间占用率。
      cacheCompression: false,
    },
  };

  /**
   * 样式文件处理
   */
  const cssPreprocessor = require('./css-processor')(env, args);
  const styleLoader = cssPreprocessor.styleLoader();
  const postcssLoader = cssPreprocessor.postcssLoader();
  // css or pcss
  const cssPreprocessors = [
    styleLoader,
    cssPreprocessor.cssLoader({
      importLoaders: 1,
    }),
    postcssLoader,
  ];
  // sass or scss
  const sassPreprocessors = [
    styleLoader,
    cssPreprocessor.cssLoader({
      importLoaders: 2,
    }),
    postcssLoader,
    cssPreprocessor.sassLoader(),
    cssPreprocessor.sassResourcesLoader(),
  ];
  const sassModulePreprocessors = Array.from(sassPreprocessors);
  sassModulePreprocessors[1] = cssPreprocessor.cssLoader({
    importLoaders: 2,
    modules: {
      localIdentName: cssModuleLocalIdentName,
    },
  });
  // less
  const lessPreprocessors = [
    styleLoader,
    cssPreprocessor.cssLoader({
      importLoaders: 2,
    }),
    postcssLoader,
    cssPreprocessor.lessLoader({
      // Enable Inline JavaScript (Deprecated) http://lesscss.org/usage/#less-options-enable-inline-javascript-deprecated-
      // this is options used for @ant-design/pro-layout
      lessOptions: {
        javascriptEnabled: true,
        // strictMath: true,
      },
    }),
  ];
  const lessModulePreprocessors = Array.from(lessPreprocessors);
  lessModulePreprocessors[1] = cssPreprocessor.cssLoader({
    importLoaders: 2,
    modules: {
      localIdentName: cssModuleLocalIdentName,
    },
  });

  // 媒体资源处理
  const assetProcessor = require('./asset-processor')(env, args);

  // 处理入口HTML模板，生成入口html文件
  const pages = require('./page-factory')(env, args);
  plugins.push(...pages.arrHtmlWebpackPlugin);
  if (IS_DEV) {
    plugins.push(new ReactRefreshWebpackPlugin());
  }

  // 抽离css。并且该插件对HMR相对于mini-css-extract-plugin支持的更好，
  // 实测中，后者并不能很好的工作 https://github.com/faceyspacey/extract-css-chunks-webpack-plugin
  // const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
  const ExtractCssChunks = require('mini-css-extract-plugin');
  plugins.push(
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `${filenamePattern}.css`,
      chunkFilename: `${chunkFilenamePattern}.css`,
      ignoreOrder: true, // Enable to remove warnings about conflicting order
    }),
  );
  // 替换style loader就可以抽离css文件了
  styleLoader.loader = ExtractCssChunks.loader;

  /**
   * 生产环境配置
   */
  // 环境变量注入
  // todo 可以从process.env读取 version 变量信息
  // const { version } = process.env
  plugins.push(
    new webpack.EnvironmentPlugin({
      commitId: gitMes.hash,
      commitAuthor: gitMes.author,
      platform: JSON.stringify(process.env.platform),
      PKG_VERSION: JSON.stringify(packageJSON.version),
      ROUTE_FILTER: require('./route.filter').generateRouteFilter().toString(),
      SVC_ENV,
      IS_DEV,
      IS_PRD,
      ..._nodeEnv,
    }),

    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false,
    }),
  );

  /**
   * Webpack Bundle Analyzer
   * Visualize size of webpack output files with an interactive zoomable treemap.
   */
  if (env.analyze) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    plugins.push(new BundleAnalyzerPlugin());
  }
  // webpack 一般配置
  const webpackConfig = {
    mode: IS_PRD ? 'production' : 'development',
    entry: { ...pages.entries, ..._entry },
    output: { ...output, ..._output },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        /**
         * sass中引用webpack alias路径别名的方式
         * @example @import '~@/src/path/to/file'
         * 引用node_modules
         * @example @import '~library/path/to/file'
         * 同时还要确保在intellij系列IDE中能够正确解析webpack配置文件
         * 如果你的webpack配置文件不在项目根目录，可以参照 https://intellij-support.jetbrains.com/hc/en-us/community/posts/360000903779/comments/360000985559
         */
        /**
         * Tip:Consider using the faster and smaller ES6 build if targeting a modern environment
         * https://github.com/mobxjs/mobx#installation
         */
        // mobx: path.resolve('node_modules/mobx/lib/mobx.es6.js'),
        '@': path.resolve('src'),
        // react-dom - hot-loader https://github.com/hot-loader/react-dom
        // 'react-dom': '@hot-loader/react-dom',
      },
      ..._resolve,
    },
    // see https://webpack.js.org/configuration/module
    module: {
      // see https://webpack.js.org/configuration/module#modulerules
      rules: [
        {
          test: /\.m?jsx?$/,
          include: directoryWhiteList,

          use: [
            {
              loader: 'thread-loader',
              // options: {
              //     workers: 8 // 开启8条进程打包
              // }
            },
            javascriptCompiler,
          ],
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.tsx?$/,
          // include: directoryWhiteList,

          use: [
            {
              loader: 'thread-loader',
              // options: {
              //     workers: 8 // 开启8条进程打包
              // }
            },
            javascriptCompiler,
          ],
          resolve: {
            fullySpecified: false,
          },
        },
        // 添加pcss支持
        {
          test: /\.p?css$/,
          // include: directoryWhiteList,
          use: cssPreprocessors,
        },
        // 添加scss支持
        {
          test: cssPreprocessor.sassLoader.test,
          exclude: cssPreprocessor.sassLoader.moduleTest,
          include: directoryWhiteList,
          use: sassPreprocessors,
        },
        // 添加scss module支持
        {
          test: cssPreprocessor.sassLoader.moduleTest,
          include: directoryWhiteList,
          use: sassModulePreprocessors,
        },
        // 添加less支持
        {
          test: cssPreprocessor.lessLoader.test,
          exclude: cssPreprocessor.lessLoader.moduleTest,
          // include: directoryWhiteList,
          use: lessPreprocessors,
        },
        // 添加less module支持
        {
          test: cssPreprocessor.lessLoader.moduleTest,
          include: directoryWhiteList,
          use: lessModulePreprocessors,
        },
        // 小于8k的小资源内嵌，反之则返回图像路径
        {
          test: /\.(jpe?g|png|webp|gif|ico|eot|ttf|woff|woff2)$/,
          // 排除Responsive Images使用场景的命名模式
          exclude: assetProcessor.responsiveLoader.test,
          // include: directoryWhiteList,
          use: [
            assetProcessor.urlLoader({
              name: `${assetFilenamePattern}-[hash].[ext]`,
            }),
          ],
        },
        // Responsive Images 工程化实践配置
        {
          // 匹配xxx.srcset.jpg xxx.srcset.png
          test: assetProcessor.responsiveLoader.test,
          include: directoryWhiteList,
          use: [
            /**
             * 在Responsive Image场景下编译时间会较长，
             * 这里有选择性的使用cache-loader来缓存编译结果。
             * 在启用cache-loader后，第二次编译你会发现，已经不再输出被responsive-loader
             * 处理的图像资源了。如果你需要重新处理图像可以选择删除cache-loader的缓存。
             * cache-loader缓存位置请查看cacheDirectory选项
             *
             * 相关问题
             * Cache loader? https://github.com/herrstucki/responsive-loader/issues/52
             */
            assetProcessor.cacheLoader(),
            assetProcessor.urlLoader(
              assetProcessor.responsiveLoader({
                name: `${assetFilenamePattern}-[width].[ext]`,
              }),
            ),
          ],
        },
        // svg支持
        {
          test: assetProcessor.svgLoader.test,
          use: [assetProcessor.svgLoader()],
        },
      ],
      ..._module,
    },
    plugins,
  };

  if (IS_PRD) {
    webpackConfig.optimization = optimization;
  }

  //  dev server
  if (IS_DEV) {
    const devServer = require('./dev-server');
    webpackConfig.devServer = {
      host: 'local-ip',
      static: './dist',
      hot: true,
      liveReload: false,
      historyApiFallback: true,
      // cors
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      // 自定义配置

      ...devServer,

      // Shows a full-screen overlay in the browser when there are compiler errors or warnings. Disabled by default.

      client: {
        progress: false,
        webSocketURL: 'auto://0.0.0.0:0/ws',
        overlay: {
          errors: false,
          warnings: false,
          runtimeErrors: false,
        },
      },

      // 可以实现一些mock功能
      // onBeforeSetupMiddleware: function(app, server) {
      //   app.get('/some/path', function(req, res) {
      //     res.json({ custom: 'response' });
      //   });
      // }
    };
  }
  /**
   * Enable typescript type checking with fork-ts-checker-webpack-plugin
   * https://stackoverflow.com/questions/54675587/babel-typescript-doesnt-throw-errors-while-webpack-build
   * ts-loader
   * https://github.com/TypeStrong/ts-loader
   */
  if (env.lint) {
    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
    webpackConfig.plugins.push(new ForkTsCheckerWebpackPlugin());
  }

  return webpackConfig;
};
