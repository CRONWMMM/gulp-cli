const TASK_CONFIG = require('../../configs/task.config');

function prodMergeTask(gulp) {
    /* build 合并构建任务 */
    gulp.task(  TASK_CONFIG.BUILD,
                [
                    TASK_CONFIG.BUILD_CLEAN,
                    TASK_CONFIG.BUILD_FONTS,
                    TASK_CONFIG.BUILD_IMAGE,
                    TASK_CONFIG.BUILD_CSS,
                    TASK_CONFIG.BUILD_SASS,
                    TASK_CONFIG.BUILD_HTML,
                    TASK_CONFIG.BUILD_JS,
                ],
                () => {

                }
            );
}


module.exports = prodMergeTask;