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
const { getFolders } = require('./utils');

/* 配置文件 ------------------------------------------------------------------------------------------------ */
const { CONTROL_CONFIG, PATH_CONFIG, TASK, ROUTES, AUTO_PREFIXER_CONFIG, BASE64_CONFIG, MODIFY_CSS_URLS_CONFIG } = require('./gulpfile.config');
const { serverPath, srcPath, devPath, prdPath, stylePath, scriptPath, imagesPath, revPath, tempPath, templatePath } = PATH_CONFIG;







/* 开发环境 (初始 npm run dev) ----------------------------------------------------------------------------------------------------------------------------------------------------------- */

module.exports = (gulp, browserSync) => {
    const reload = browserSync.reload;

    /* clean 文件清除任务 */
    gulp.task(TASK.DEV.CLEAN.ALL, () => {
        return gulp.src([devPath], {read: false})
            .pipe(clean());
    });




    /* style 任务 */
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
        // 替换link文件的href引用地址
            .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${stylePath.outputFolder}/$2$3`))
            // 替换除了script文件的其他src资源引用地址
            // 图片资源
            .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${imagesPath}$2$3$4`))
            // 视音频资源后面再加
            .pipe(gulp.dest(`${tempPath.dev}`));    // 将替换后的html文件装填到新目录
    });



    /* JS 任务 */
    gulp.task(TASK.DEV.SCRIPT.MAIN, [TASK.DEV.HTML], () => {
        webpack(require('./webpack.dev.conf.js'), (err, status) => {
            if (err != null) console.log('webpack bundle script error, information: ', err);
            // 完成之后将 build 里的模板文件重输出到temp目录，保证两个目录的文件统一
            gulp.src(`${devPath}**/*.html`)
                .pipe(gulp.dest(`${tempPath.dev}`));
        });
    });



    /* image 任务 */
    gulp.task(TASK.DEV.IMAGE.MAIN, () => {
        // 检测对应搜索路径下的文件夹
        let folders = getFolders(`${srcPath}${imagesPath}`),
            tasks = [];
        // 先检测 static/images/ 下的文件
        tasks.push(gulp.src(`${srcPath}${imagesPath}*.*`).pipe(imagemin()).pipe(gulp.dest(`${devPath}${imagesPath}`)));
        // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
        if (folders.length > 0) {
            let taskList = folders.map(folder => gulp.src(path.join(`${srcPath}${imagesPath}`, folder, '/*.*')).pipe(imagemin()).pipe(gulp.dest(`${devPath}${imagesPath}`)));
            tasks.push(...taskList);
        }
        return merge(tasks);
    });


    /* dev 合并构建任务 */
    gulp.task(TASK.DEV.MAIN, [TASK.DEV.CLEAN.ALL, TASK.DEV.STYLE.SASS, TASK.DEV.SCRIPT.MAIN, TASK.DEV.IMAGE.MAIN, TASK.DEV.NODEMON, TASK.DEV.BROWSER_SYNC], () => {});





    /* 启动 server 任务 -------------------------------------------------- */
    // 启动NodeJS服务文件
    gulp.task(TASK.DEV.NODEMON, [TASK.DEV.CLEAN.ALL, TASK.DEV.STYLE.SASS, TASK.DEV.SCRIPT.MAIN, TASK.DEV.IMAGE.MAIN], (cb) => {
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

    // 浏览器同步，用7000端口去代理Express的3008端口
    gulp.task(TASK.DEV.BROWSER_SYNC, [TASK.DEV.NODEMON], function() {
        browserSync.init({
            notify: false,//关闭页面通知
            proxy: ROUTES.PROXY,
            browser: "chrome",
            port: ROUTES.PORT
        });

        // 监听模板文件
        gulp.watch(`${srcPath}${templatePath.root}**/*.html`, [ TASK.DEV.RUNTIME_HTML ]).on('change', reload);
        // 监听样式文件【sass】
        gulp.watch(`${srcPath}${stylePath.sass.root}**/*.scss`, [ TASK.DEV.RUNTIME_STYLE.SASS ]).on('change', reload);
        // 监听脚本文件【js】
        gulp.watch(`${srcPath}${scriptPath}**/*.js`, [ TASK.DEV.RUNTIME_SCRIPT.MAIN ]);
        // 监听静态资源【image】
        gulp.watch(`${srcPath}${imagesPath}**/*`, [ TASK.DEV.IMAGE ]).on('change', reload);
    });
};