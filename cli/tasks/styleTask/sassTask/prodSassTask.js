const cssmin = require('gulp-cssmin');
const sass = require('gulp-sass');
const base64 = require('gulp-base64');
const rev = require('gulp-rev');
const autoPrefixer = require('gulp-autoprefixer');
const modifyCssUrls = require('gulp-modify-css-urls');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { AUTO_PREFIXER_CONFIG, BASE64_CONFIG, MODIFY_CSS_URLS_CONFIG } = require('../../../gulpfile.config');
const { srcPath, prodPath, stylePath, revPath } = PATH_CONFIG;

function prodSassTask(gulp) {
    /* sass 任务 */
    gulp.task(TASK_CONFIG.BUILD.STYLE.SASS, [TASK_CONFIG.BUILD.CLEAN.MAIN], () => {
        return gulp.src(`${srcPath}${stylePath.sass.entry}`)
            .pipe(sass().on('error', sass.logError))  // sass 文件编译
            .pipe(base64(BASE64_CONFIG.BUILD))  // base64压缩小图片
            .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.BUILD)) // 替换 css 样式文件中的 url 地址
            .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.BUILD)) // css 样式前缀
            .pipe(cssmin()) // css 压缩
            .pipe(rev())    // 装填生产环境之前先对文件名加md5后缀，防止本地缓存
            .pipe(gulp.dest(`${prodPath}${stylePath.outputFolder}`))
            .pipe(rev.manifest(`${revPath.fileName.css}`, {}))   // 生成JSON的映射表
            .pipe(gulp.dest(`${revPath.root}`));  // 装填JSON映射表
    });
}


module.exports = prodSassTask;