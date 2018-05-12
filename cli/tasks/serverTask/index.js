const nodemon = require('gulp-nodemon');
const { PATH_CONFIG, TASK, ROUTES } = require('../../gulpfile.config');
const { srcPath, stylePath, scriptPath, imagesPath, templatePath } = PATH_CONFIG;

function serverTask(gulp, browserSync) {
    const reload = browserSync.reload;
    /* 启动 server 任务 */
    // 启动NodeJS服务文件
    gulp.task(TASK.DEV.NODEMON, [TASK.DEV.CLEAN.ALL, TASK.DEV.STYLE.SASS, TASK.DEV.HTML, TASK.DEV.SCRIPT.MAIN, TASK.DEV.IMAGE.MAIN], (cb) => {
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

    gulp.task(TASK.DEV.BROWSER_SYNC, [TASK.DEV.NODEMON], () => {
        browserSync.init({
            notify: false,   // 关闭页面通知
            proxy: ROUTES.PROXY,
            browser: "chrome",
            port: ROUTES.PORT
        });

        // 监听模板文件
        gulp.watch(`${srcPath}${templatePath.root}**/*.html`, [ TASK.DEV.RUNTIME_HTML, TASK.DEV.RUNTIME_FILE_SYNC ]).on('change', reload);
        // 监听样式文件【sass】
        gulp.watch(`${srcPath}${stylePath.sass.root}**/*.scss`, [ TASK.DEV.RUNTIME_STYLE.SASS ]).on('change', reload);
        // 监听脚本文件【js】
        gulp.watch(`${srcPath}${scriptPath}**/*.js`, [ TASK.DEV.RUNTIME_SCRIPT.MAIN ]);
        // 监听静态资源【image】
        gulp.watch(`${srcPath}${imagesPath}**/*`, [ TASK.DEV.RUNTIME_IMAGE.MAIN ]).on('change', reload);
    });
}

module.exports = serverTask;