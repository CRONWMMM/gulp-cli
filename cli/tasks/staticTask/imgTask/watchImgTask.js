const path = require('path');
const clean = require('gulp-clean');
const flatten = require('gulp-flatten');
const merge = require('merge-stream');
const imagemin = require('gulp-imagemin');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { srcPath, devPath, staticPath, imagesPath } = PATH_CONFIG;


function watchImgTask(gulp) {
    // image 任务
    gulp.task(TASK_CONFIG.RUNTIME_IMAGE, () => {
        return gulp.src(`${srcPath}${imagesPath}`)
                    .pipe(imagemin())
                    .pipe(flatten())
                    .pipe(gulp.dest(`${devPath}${staticPath}`))
    });
}


module.exports = watchImgTask;