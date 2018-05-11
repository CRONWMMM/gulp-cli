const clean = require('gulp-clean');
const { PATH_CONFIG, TASK } = require('../../gulpfile.config');
const { devPath } = PATH_CONFIG

function devCleanTask(gulp) {
    /* clean 文件清除任务 */
    gulp.task(TASK.DEV.CLEAN.ALL, () => {
        return gulp.src([devPath], {read: false})
            .pipe(clean());
    });
}

module.exports = devCleanTask