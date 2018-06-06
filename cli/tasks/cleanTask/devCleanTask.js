const clean = require('gulp-clean');
const TASK_CONFIG = require('../../configs/task.config');
const PATH_CONFIG = require('../../configs/path.config');
const { devPath } = PATH_CONFIG

function devCleanTask(gulp) {
    /* clean 文件清除任务 */
    gulp.task(TASK_CONFIG.DEV_CLEAN, () => {
        return gulp.src([devPath], {read: false})
            .pipe(clean());
    });
}

module.exports = devCleanTask