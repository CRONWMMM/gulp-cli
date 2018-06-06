const nodemon = require('gulp-nodemon');
const TASK_CONFIG = require('../../configs/task.config');
const PATH_CONFIG = require('../../configs/path.config');
const SERVER_CONFIG = require('../../configs/server.config');
const { srcPath, stylePath, scriptPath, imagesPath, templatePath } = PATH_CONFIG;

function serverTask(gulp, browserSync) {
    const reload = browserSync.reload;
    /* 启动 server 任务 */
    // 启动NodeJS服务文件
    gulp.task(TASK_CONFIG.DEV_NODEMON, [TASK_CONFIG.DEV_CLEAN, TASK_CONFIG.DEV_SASS, TASK_CONFIG.DEV_HTML, TASK_CONFIG.DEV_JS, TASK_CONFIG.DEV_IMAGE], (cb) => {
        let started = false;
        return nodemon({
            script: 'server.js'
        }).on('start', () => {
            if (!started) {
                cb();
                started = true;
            }
        });
    });

    gulp.task(TASK_CONFIG.DEV_BROWSER_SYNC, [TASK_CONFIG.DEV_NODEMON], () => {
        browserSync.init({
            notify: false,   // 关闭页面通知
            proxy: SERVER_CONFIG.PROXY,
            browser: "chrome",
            port: SERVER_CONFIG.PORT
        });

        // 监听模板文件
        gulp.watch(`${srcPath}${templatePath.root}**/*.html`, [ TASK_CONFIG.RUNTIME_HTML, TASK_CONFIG.RUNTIME_FILE_SYNC ]).on('change', reload);
        // 监听样式文件【sass】
        gulp.watch(`${srcPath}${stylePath.sass.root}**/*.scss`, [ TASK_CONFIG.RUNTIME_SASS ]).on('change', reload);
        // 监听脚本文件【js】
        gulp.watch(`${srcPath}${scriptPath}**/*.js`, [ TASK_CONFIG.RUNTIME_JS ]);
        // 监听静态资源【image】
        gulp.watch(`${srcPath}${imagesPath}**/*`, [ TASK_CONFIG.RUNTIME_IMAGE ]).on('change', reload);
    });
}

module.exports = serverTask;