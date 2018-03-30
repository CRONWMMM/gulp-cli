/**
 * Created by CRONWMMM on 2018/3/29.
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const modifyCssUrls = require('gulp-modify-css-urls');
const clean = require('gulp-clean');
const replace = require('gulp-replace');
const changed = require('gulp-changed');
const cheerio = require('gulp-cheerio');
const merge = require('merge-stream');
const webpack = require('webpack');
const { getFolders } = require('./utils');
const { CONTROL_CONFIG, PATH_CONFIG, TASK, ROUTES, AUTO_PREFIXER_CONFIG, BASE64_CONFIG, MODIFY_CSS_URLS_CONFIG } = require('./gulpfile.config');
const { serverPath, srcPath, devPath, prodPath, stylePath, scriptPath, imagesPath, revPath, runTimePath, templatePath } = PATH_CONFIG;


/* 生产环境 ----------------------------------------------------------------------------------------------------------------------------------------------------------- */
module.exports = gulp => {
    /* clean 文件清除任务 */
    gulp.task(TASK.BUILD.CLEAN, () => {
        return gulp.src([prodPath, revPath.root], {read: false})
            .pipe(clean());
    });


    /* style 任务 */
    gulp.task(TASK.BUILD.STYLE.SASS, [TASK.BUILD.CLEAN], () => {
        return gulp.src(`${srcPath}${stylePath.sass.entry}`)
            .pipe(sass().on('error', sass.logError))  // sass 文件编译
            .pipe(base64(BASE64_CONFIG.BUILD))  // base64压缩小图片
            .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.BUILD)) // 替换 css 样式文件中的 url 地址
            .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.BUILD)) // css 样式前缀
            .pipe(cssmin()) // css 压缩
            .pipe(rev())    // 装填生产环境之前先对文件名加md5后缀，防止本地缓存
            .pipe(gulp.dest(`${prodPath}${stylePath.outputFolder}`))
            .pipe(rev.manifest(`${revPath.fileName.css}`, {}))   // 生成JSON的映射表
            .pipe(gulp.dest(`${revPath.root}`));  // 装填JSON映射表
    });
// 通过样式映射表修改html文件上引用的css文件路径
    gulp.task(TASK.BUILD.HTML, [TASK.BUILD.STYLE.SASS], () => {
        return gulp.src([`${revPath.root}**/*.json`, `${srcPath}**/*.html`])
            .pipe(revCollector())   // 替换静态资源MD5文件名
            // 替换link文件的href引用地址
            .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${stylePath.outputFolder}/$2$3`))
            // 替换除了script文件的其他src资源引用地址
            // 图片资源
            .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${imagesPath}$2$3$4`))
            // 视音频资源后面再加
            .pipe(gulp.dest(`${runTimePath.build}`));    // 将替换后的html文件装填到新目录
    });

    /* JS 任务 */
    gulp.task(TASK.BUILD.SCRIPT.MAIN, [TASK.BUILD.HTML], () => {
        webpack(require('./webpack.prod.conf.js'), (err, stats) => {});
    });


    /* image 任务 */
    gulp.task(TASK.BUILD.IMAGE.MAIN, () => {
        let folders = getFolders(`${srcPath}${imagesPath}`),
            tasks = [];

        tasks.push(
            gulp.src([ `${prodPath}${imagesPath}` ], {read: false})
                .pipe(clean()),

            gulp.src(`${srcPath}${imagesPath}*.*`).pipe(imagemin({
                    progressive: true,// 无损压缩JPG图片
                    svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
                }))
                .pipe(gulp.dest(`${prodPath}${imagesPath}`))
        );
        if (folders.length > 0) {
            let taskList = folders.map(folder => gulp.src(path.join(`${srcPath}${imagesPath}`, folder, '/*.*')).pipe(imagemin({
                progressive: true,// 无损压缩JPG图片
                svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
            })).pipe(gulp.dest(`${prodPath}${imagesPath}`)));
            tasks.push(...taskList);
        }
        return merge(tasks);
    });




    /* build 合并构建任务 */
    gulp.task(TASK.BUILD.MAIN, [TASK.BUILD.CLEAN, TASK.BUILD.STYLE.SASS, TASK.BUILD.HTML, TASK.BUILD.SCRIPT.MAIN, TASK.BUILD.IMAGE.MAIN], () => {
        gulp.src([runTimePath.build], {read: false})
            .pipe(clean());
    });
};
