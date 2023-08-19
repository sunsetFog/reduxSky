import { dest, series, src, task } from 'gulp'
// https://github.com/jgable/gulp-cache
import cache from 'gulp-cache'
/**
 * 如何将现有图像转换为webp
 * https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/automating-image-optimization/#how-do-i-convert-to-webp
 */
// https://github.com/sindresorhus/gulp-webp
import webp from 'gulp-webp'
import ReadWriteStream = NodeJS.ReadWriteStream

// 图像匹配规则，排除文件名含有srcset的图像，srcset交给responsive loader来处理
const imagesGlobRule = 'src/**/!(*srcset*).{jp*g, png}'
const webpDist = 'src'
task('webp', () =>
  src(imagesGlobRule)
    // 有损压缩模式
    .pipe<ReadWriteStream>(
      // 图像格式转换或压缩是一个耗时任务，这里加上cache
      cache(
      /**
       * imagemin-webp 选项 https://github.com/imagemin/imagemin-webp#imageminwebpoptions
       * imagemin-webp 选项与cwebp的映射关系 https://github.com/imagemin/imagemin-webp/blob/master/index.js
       * cwebp命令行工具选项 https://developers.google.com/speed/webp/docs/cwebp
       */
        webp({
          preset: 'photo',
          // 默认质量75，最高100
          // quality: 75,
          /**
           * cwebp -m int
           * 0 to 6
           * When higher values are used, the encoder will spend more time inspecting
           * additional encoding possibilities and decide on the quality gain. Lower
           * value can result in faster processing time at the expense of larger
           * file size and lower compression quality.
           * 值越低，速度越快，相应文件尺寸降得越少
           */
          method: 6,
        }),
      ),
    )
    .pipe(dest(webpDist)),
)
task('webp-lossless', () =>
  // 无损压缩模式，可能图片会变大
  src(imagesGlobRule)
    .pipe<ReadWriteStream>(
      /**
       * 注意：如果切换到此任务，应当gulp clear先清除缓存
       * 缓存是根据源文件而做的，源文件没有改变，当前任务不会真正执行
       */
      cache(
        webp({
          lossless: true,
        }),
      ),
    )
    .pipe(dest(webpDist)),
)

/**
 * 清除缓存
 * https://github.com/jgable/gulp-cache#clearing-the-cache
 */
task('clear', () => cache.clearAll())
/**
 * 先清除缓存，然后在调用webp任务
 */
task('clear->webp', series('clear', 'webp'))
task(
  'clear->webp-lossless',
  series('clear', 'webp-lossless'),
)
