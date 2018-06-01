const clean = require('gulp-clean');
const TASK_CONFIG = require('../../configs/task.config');
const PATH_CONFIG = require('../../configs/path.config');
const { runTimePath } = PATH_CONFIG;

function prodMergeTask(gulp) {
    /* build 合并构建任务 */
    gulp.task(TASK_CONFIG.BUILD,
                [
                    TASK_CONFIG.BUILD_CLEAN,
                    TASK_CONFIG.BUILD_FONTS,
                    TASK_CONFIG.BUILD_CSS,
                    TASK_CONFIG.BUILD_SASS,
                    TASK_CONFIG.BUILD_HTML,
                    TASK_CONFIG.BUILD_JS,
                    TASK_CONFIG.BUILD_IMAGE
                ], () => {
        gulp.src([runTimePath.build], {read: false})
            .pipe(clean());
    });
}


module.exports = prodMergeTask;