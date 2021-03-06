const clean = require('gulp-clean');
const TASK_CONFIG = require('../../configs/task.config');
const PATH_CONFIG = require('../../configs/path.config');
const { prodPath, revPath } = PATH_CONFIG;


function prodCleanTask(gulp) {
    /* clean 文件清除任务 */
    gulp.task(TASK_CONFIG.BUILD_CLEAN, () => {
        return gulp.src([prodPath, revPath], {read: false})
            .pipe(clean());
    });
}


module.exports = prodCleanTask;
