/**
 * Created by CRONWMMM on 2018/3/29.
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const modifyCssUrls = require('gulp-modify-css-urls');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');
const replace = require('gulp-replace');
const changed = require('gulp-changed');
const cheerio = require('gulp-cheerio');
const merge = require('merge-stream');
const webpack = require('webpack');


/* utils -------------------------------------------------------------------------------------------------- */
const { deeplySearchInFolders } = require('./utils');

/* 配置文件 ------------------------------------------------------------------------------------------------ */
const { CONTROL_CONFIG, PATH_CONFIG, TASK, ROUTES, AUTO_PREFIXER_CONFIG, BASE64_CONFIG, MODIFY_CSS_URLS_CONFIG } = require('./gulpfile.config');
const { serverPath, srcPath, devPath, prdPath, stylePath, scriptPath, staticPath, imagesPath, fontsPath, revPath, runTimePath, templatePath } = PATH_CONFIG;







/* 开发环境 (初始 npm run dev) ----------------------------------------------------------------------------------------------------------------------------------------------------------- */

module.exports = (gulp, browserSync) => {
    const reload = browserSync.reload;

    /* clean 文件清除任务 */
    gulp.task(TASK.DEV.CLEAN.ALL, () => {
        return gulp.src([devPath], {read: false})
            .pipe(clean());
    });


    /* fonts 任务 */
    gulp.task(TASK.DEV.FONTS.MAIN, [TASK.DEV.CLEAN.ALL], () => {
        return gulp.src(`${srcPath}${fontsPath}**/*`)
            .pipe(gulp.dest(`${devPath}${staticPath}`));
    })

    /* css 任务 */
    gulp.task(TASK.DEV.STYLE.CSS, [TASK.DEV.CLEAN.ALL], () => {
        return gulp.src(`${srcPath}${stylePath.css.entry}`)
            .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.DEV)) // 替换 css 样式文件中的 url 地址
            //.pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
            .pipe(gulp.dest(`${devPath}${stylePath.outputFolder}`));
    });

    /* sass 任务 */
    gulp.task(TASK.DEV.STYLE.SASS, [TASK.DEV.CLEAN.ALL], () => {
        return gulp.src(`${srcPath}${stylePath.sass.entry}`)
            .pipe(sass().on('error', sass.logError))  // sass 文件编译
            .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.DEV))   // css 样式前缀
            .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.DEV)) // 替换 css 样式文件中的 url 地址
            //.pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
            .pipe(gulp.dest(`${devPath}${stylePath.outputFolder}`));
    });

    /* html 任务 */
    gulp.task(TASK.DEV.HTML, [TASK.DEV.STYLE.SASS], () => {
        return gulp.src(`${srcPath}**/*.html`)
            .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${stylePath.outputFolder}/$2$3`))
            .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${staticPath}$2$3$4`))
            .pipe(gulp.dest(`${runTimePath.dev}`));
    });



    /* JS 任务 */
    gulp.task(TASK.DEV.SCRIPT.MAIN, [TASK.DEV.HTML], () => {
        webpack(require('./webpack.dev.conf.js'), (err, status) => {
            if (err != null) console.log('webpack bundle script error, information: ', err);
            // 完成之后将 build 里的模板文件重输出到temp目录，保证两个目录的文件统一
            gulp.src([`${devPath}**/*.html`, `!${runTimePath.dev}**/*.html`])
                .pipe(gulp.dest(`${runTimePath.dev}`));
        });
    });



    /* image 任务 */
    gulp.task(TASK.DEV.IMAGE.MAIN, [TASK.DEV.SCRIPT.MAIN], () => {
        // 检测对应搜索路径下的文件夹
        let tasks = [];
        // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
        deeplySearchInFolders(`${srcPath}${imagesPath}`, (dir) => {
            tasks.push(
                gulp.src(path.join(dir, '/*.*'))
                    .pipe(imagemin())
                    .pipe(gulp.dest(`${devPath}${staticPath}`))
            )
        })
        return merge(tasks);
    });
    /*
    gulp.task(TASK.DEV.IMAGE.MAIN, [TASK.DEV.SCRIPT.MAIN], () => {
        // 检测对应搜索路径下的文件夹
        let folders = getFolders(`${srcPath}${imagesPath}`),
            tasks = [];
        // 先检测 static/images/ 下的文件
        tasks.push(
            gulp.src(`${srcPath}${imagesPath}*.*`)
                .pipe(imagemin())
                .pipe(gulp.dest(`${devPath}${staticPath}`))
        );
        // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
        if (folders.length > 0) {
            let taskList = folders.map(folder => gulp.src(path.join(`${srcPath}${imagesPath}`, folder, '/*.*')).pipe(imagemin()).pipe(gulp.dest(`${devPath}${staticPath}`)));
            tasks.push(...taskList);
        }
        console.log(tasks.length)
        return merge(tasks);
    });
     */


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