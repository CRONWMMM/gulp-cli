const path = require('path');
const flatten = require('gulp-flatten');
const imagemin = require('gulp-imagemin');
const { deeplySearchInFolders } = require('../../../utils');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { devPath, srcPath, imagesPath, staticPath } = PATH_CONFIG


function devImgTask(gulp) {
    /* image 任务 */
    gulp.task(TASK_CONFIG.DEV_IMAGE, [TASK_CONFIG.DEV_JS], () => {
        return gulp.src(`${srcPath}${imagesPath}**/*`)
                    .pipe(imagemin())
                    .pipe(flatten())
                    .pipe(gulp.dest(`${devPath}${staticPath}`))
    });
}


module.exports = devImgTask