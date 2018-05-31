const TASK_CONFIG = require('../../configs/task.config');

function devMergeTask(gulp) {

    /* dev 合并构建任务 */
    gulp.task(TASK_CONFIG.DEV.MAIN,
                [
                    TASK_CONFIG.DEV.CLEAN.MAIN,
                    TASK_CONFIG.DEV.STYLE.CSS,
                    TASK_CONFIG.DEV.STYLE.SASS,
                    TASK_CONFIG.DEV.HTML,
                    TASK_CONFIG.DEV.SCRIPT.MAIN,
                    TASK_CONFIG.DEV.IMAGE.MAIN,
                    TASK_CONFIG.DEV.FONTS.MAIN,
                    TASK_CONFIG.DEV.NODEMON,
                    TASK_CONFIG.DEV.BROWSER_SYNC
                ], () => {});

}


module.exports = devMergeTask