/**
 * Created by CRONWMMM on 2018/3/29.
 */

const fs = require('fs');
const path = require('path');
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');
const changed = require('gulp-changed');
const cheerio = require('gulp-cheerio');
const merge = require('merge-stream');
const webpack = require('webpack');


/* 配置文件 ------------------------------------------------------------------------------------------------ */
const { PATH_CONFIG, TASK, ROUTES } = require('./gulpfile.config');
const { srcPath, stylePath, scriptPath, imagesPath, templatePath } = PATH_CONFIG;


/* tasks -------------------------------------------------------------------------------------------------- */
const devCleanTask = require('./tasks/cleanTask/devCleanTask');
const devFontTask = require('./tasks/staticTask/fontTask/devFontTask');
const devCssTask = require('./tasks/styleTask/cssTask/devCssTask');
const devSassTask = require('./tasks/styleTask/sassTask/devSassTask');
const devHtmlTask = require('./tasks/templateTask/htmlTask/devHtmlTask');
const devJsTask = require('./tasks/scriptTask/jsTask/devJsTask');
const devImgTask = require('./tasks/staticTask/imgTask/devImgTask');


/* 开发环境 (初始 npm run dev) ----------------------------------------------------------------------------------------------------------------------------------------------------------- */

module.exports = (gulp, browserSync) => {
    const reload = browserSync.reload;

    /* clean 任务 */
    devCleanTask(gulp);
    /* font 任务 */
    devFontTask(gulp);
    /* css 任务 */
    devCssTask(gulp);
    /* sass 任务 */
    devSassTask(gulp);
    /* html 任务 */
    devHtmlTask(gulp);
    /* JS 任务 */
    devJsTask(gulp);
    /* img 任务 */
    devImgTask(gulp);



    /* dev 合并构建任务 */
    gulp.task(TASK.DEV.MAIN, [TASK.DEV.CLEAN.ALL, TASK.DEV.STYLE.CSS, TASK.DEV.STYLE.SASS, TASK.DEV.HTML, TASK.DEV.SCRIPT.MAIN, TASK.DEV.IMAGE.MAIN, TASK.DEV.FONTS.MAIN, TASK.DEV.NODEMON, TASK.DEV.BROWSER_SYNC], () => {});





    /* 启动 server 任务 -------------------------------------------------- */
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
};