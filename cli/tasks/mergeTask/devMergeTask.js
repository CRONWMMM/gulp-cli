const TASK_CONFIG = require('../../configs/task.config');

function devMergeTask(gulp) {

    /* dev 合并构建任务 */
    gulp.task(TASK_CONFIG.DEV,
                [
                    TASK_CONFIG.DEV_CLEAN,
                    TASK_CONFIG.DEV_CSS,
                    TASK_CONFIG.DEV_SASS,
                    TASK_CONFIG.DEV_HTML,
                    TASK_CONFIG.DEV_JS,
                    TASK_CONFIG.DEV_IMAGE,
                    TASK_CONFIG.DEV_FONTS,
                    TASK_CONFIG.DEV_NODEMON,
                    TASK_CONFIG.DEV_BROWSER_SYNC,
                ], () => {});

}


module.exports = devMergeTask