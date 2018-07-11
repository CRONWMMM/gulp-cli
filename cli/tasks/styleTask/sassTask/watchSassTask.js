const clean = require('gulp-clean');
const sass = require('gulp-sass');
const flatten = require('gulp-flatten');
const plumber = require('gulp-plumber');
const autoPrefixer = require('gulp-autoprefixer');
const merge = require('merge-stream');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { AUTO_PREFIXER_CONFIG } = require('../../../configs/plugins.config');
const { srcPath, devPath, sassPath, styleOutPutPath } = PATH_CONFIG;

function prodSassTask(gulp) {
    // sass 任务
    gulp.task(TASK_CONFIG.RUNTIME_SASS, () => {
        return gulp.src(`${srcPath}${sassPath}**/*.scss`)
                    .pipe(plumber({
                        errorHandler(error) {
                            console.log(error)
                            this.emit('end')
                        }
                    }))
                    .pipe(sass().on('error', sass.logError))  // sass 文件编译
                    // .pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
                    .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.DEV))   // css 样式前缀
                    .pipe(flatten())
                    .pipe(gulp.dest(`${devPath}${styleOutPutPath}`))
    });
}


module.exports = prodSassTask;