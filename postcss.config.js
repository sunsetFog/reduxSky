// see https://github.com/postcss/postcss-loader#configuration
const pkg = require('./package.json');
module.exports = ({ options = {} }) => {
  const { args = {} } = options;
  const env = args.env || {};
  const plugins = {};
  const isPrd = (args.mode || process.env.NODE_ENV) === 'production';

  // 如果开启了--env.lint则在编译时开启检查
  if (env.lint) {
    // css兼容性检查 https://github.com/anandthakker/doiuse
    plugins.doiuse = {
      browsers: require('./package').browserslist,
    };
  }

  return {
    plugins: {
      /**
       * LostGrid makes use of calc() to create stunning grids based on fractions you define without having to pass a lot of options.
       * see https://github.com/peterramsing/lost
       */
      // lost: {},
      // https://github.com/csstools/postcss-preset-env
      // 将默认使用browsers list配置文件来断言需要支持的设备列表
      'postcss-preset-env': {
        // 使用stage 0尽量兼容更低版本的浏览器 https://github.com/csstools/postcss-preset-env#stage
        // 使用stage 0将css中使用的新特性视为实验性质，将经可能的转换成更低版本的css代码
        stage: 0,
        // see https://github.com/postcss/autoprefixer
        autoprefixer: {
          /**
           * 根据需要而选择是否让IE支持grid特性
           * Autoprefixer can be used to translate modern CSS Grid syntax
           * into IE 10 and IE 11 syntax, but this polyfill will not work in 100% of cases.
           * This is why it is disabled by default.
           * see https://github.com/postcss/autoprefixer#does-autoprefixer-polyfill-grid-layout-for-ie
           */
          // grid: true
        },
      },

      // css minimizer
      cssnano: isPrd
        ? {
            // cssnano preset configuration
            // see https://cssnano.co/guides/presets
            // see https://cssnano.co/guides/optimisations
            preset: [
              'default',
              {
                // see https://cssnano.co/optimisations/discardcomments
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          }
        : false,

      /**
       * px to viewport
       * https://github.com/evrone/postcss-px-to-viewport#usage
       * Note: 开发阶段建议保持默认px单位，便于在浏览器中对px单位进行微调
       */
      'postcss-px-to-viewport':
        pkg?.platform === 'h5'
          ? {
              unitToConvert: 'px', //需要转换的单位，默认为"px"
              viewportWidth: 390, // 视窗的宽度，对应的是我们设计稿的宽度
              unitPrecision: 6, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
              propList: ['*'], // 能转化为vw的属性列表
              viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
              fontViewportUnit: 'vw', //字体使用的视口单位
              selectorBlackList: ['ignorePx'], //指定不转换为视窗单位的类,类名包含ignorePx字段不发生转化,忽略单行， PX大写,如果prettier格式化为小写 就在这行上面加/* prettier-ignore */
              minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
              mediaQuery: true, // 允许在媒体查询中转换`px`
              replace: true, //是否直接更换属性值，而不添加备用属性
              exclude: [/node_modules/], //忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
              landscape: false, //是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
              landscapeUnit: 'vw', //横屏时使用的单位
              landscapeWidth: 568, //横屏时使用的视口宽度
            }
          : false,

      ...plugins,
    },
  };
};
