const cssmin = require('gulp-cssmin');
const sass = require('gulp-sass');
const flatten = require('gulp-flatten');
const base64 = require('gulp-base64');
const rev = require('gulp-rev');
const autoPrefixer = require('gulp-autoprefixer');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { AUTO_PREFIXER_CONFIG, BASE64_CONFIG } = require('../../../configs/plugins.config');
const { srcPath, prodPath, sassPath, styleOutPutPath, revPath } = PATH_CONFIG;

function prodSassTask(gulp) {
    /* sass 任务 */
    gulp.task(TASK_CONFIG.BUILD_SASS, [TASK_CONFIG.BUILD_CLEAN, TASK_CONFIG.BUILD_CSS], () => {
        return gulp.src(`${srcPath}${sassPath}*.scss`)
            .pipe(sass().on('error', sass.logError))  // sass 文件编译
            .pipe(base64(BASE64_CONFIG.BUILD))  // base64压缩小图片
            .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.BUILD)) // css 样式前缀
            .pipe(cssmin()) // css 压缩
            .pipe(rev())    // 装填生产环境之前先对文件名加md5后缀，防止本地缓存
            .pipe(flatten())
            .pipe(gulp.dest(`${prodPath}${styleOutPutPath}`))
            .pipe(rev.manifest())   // 生成JSON的映射表
            .pipe(gulp.dest(`${revPath}sass`));  // 装填JSON映射表
    });
}


module.exports = prodSassTask;