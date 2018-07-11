const path = require('path');
const flatten = require('gulp-flatten');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { prodPath, staticPath, imagesPath } = PATH_CONFIG;

function prodImgTask(gulp) {
    /* image 任务 */
    gulp.task(TASK_CONFIG.BUILD_IMAGE, () => {
        return gulp.src(`${srcPath}${imagesPath}`)
                    .pipe(imagemin({
                        progressive: true,// 无损压缩JPG图片
                        svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
                    }))
                    .pipe(flatten())
                    .pipe(gulp.dest(`${prodPath}${staticPath}`))
    });
}


module.exports = prodImgTask;