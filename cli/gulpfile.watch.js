/**
 * Created by CRONWMMM on 2018/3/30.
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');                          // 处理sass
const autoPrefixer = require('gulp-autoprefixer');          // css样式自动加前缀
const modifyCssUrls = require('gulp-modify-css-urls');      // css 文件中 url 引用路径处理
const clean = require('gulp-clean');
const replace = require('gulp-replace');
const changed = require('gulp-changed');
const cheerio = require('gulp-cheerio');
const merge = require('merge-stream');
const webpack = require('webpack');
const { CONTROL_CONFIG, PATH_CONFIG, TASK, ROUTES, AUTO_PREFIXER_CONFIG, BASE64_CONFIG, MODIFY_CSS_URLS_CONFIG } = require('./gulpfile.config');
const { serverPath, srcPath, devPath, prodPath, stylePath, scriptPath, imagesPath, revPath, runTimePath, templatePath } = PATH_CONFIG;




/* watch 文件文件改变执行的分任务 --------------------------------------------------------------------------------------------------------------------------------------------------------- */

module.exports = (gulp, browserSync) => {
    // html 任务
    gulp.task(TASK.DEV.RUNTIME_HTML, () => {
        let tasks = [],
            scriptSrcList = [];
        tasks.push(
            gulp.src(`${runTimePath.dev}**/*.html`)
                .pipe(cheerio(($, file) => {
                    scriptSrcList = [];
                    $('script').each(function() {
                        let $script = $(this),
                            src = $script.attr('src');
                        scriptSrcList.push(src);
                    });
                })),

            gulp.src(`${srcPath}**/*.html`)
                .pipe(changed(`${devPath}`))
                .pipe(cheerio(($, file) => {
                    let $body = $('body');
                    scriptSrcList.forEach(item => {
                        $body.append(`<script type="text/javascript" src="${item}"></script>`);
                    });
                    scriptSrcList = [];
                }))
                .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${stylePath.outputFolder}/$2$3`))
                .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${imagesPath}$2$3$4`))
                .pipe(gulp.dest(`${devPath}`)),

            gulp.src(`${devPath}**/*.html`)
                .pipe(gulp.dest(`${runTimePath.dev}`))

        );
        return merge(tasks);
    });


// style 任务
    gulp.task(TASK.DEV.RUNTIME_STYLE.SASS, () => {
        let tasks = [];
        tasks.push(
            gulp.src([`${devPath}${stylePath.outputFolder}/**/*`], {read: false})
                .pipe(clean()),

            gulp.src(`${srcPath}${stylePath.sass.entry}`)
                .pipe(sass().on('error', sass.logError))  // sass 文件编译
                // .pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
                .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.DEV))   // css 样式前缀
                .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.DEV)) // 替换 css 样式文件中的 url 地址
                .pipe(gulp.dest(`${devPath}${stylePath.outputFolder}`))
        );
        return merge(tasks);
    });


// script 任务
    gulp.task(TASK.DEV.CLEAN.SCRIPT, () => {
        let tasks = [];
        tasks.push(
            gulp.src([`${devPath}${scriptPath.root}`], {read: false})
                .pipe(clean()),

            gulp.src(`${runTimePath.dev}**/*.html`)
                .pipe(replace(/<script[\w\W\s]+><\/script>/g, ''))
                .pipe(gulp.dest(`${runTimePath.dev}`))
        );
        return merge(tasks);
    });
    gulp.task(TASK.DEV.RUNTIME_SCRIPT.MAIN, [ TASK.DEV.CLEAN.SCRIPT ], () => {
        webpack(require('./webpack.dev.conf.js'), (err, stats) => {
            browserSync.reload();
        });
    });
};