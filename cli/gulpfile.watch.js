/**
 * Created by CRONWMMM on 2018/3/30.
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');                          // 处理sass
const autoPrefixer = require('gulp-autoprefixer');          // css样式自动加前缀
const modifyCssUrls = require('gulp-modify-css-urls');      // css 文件中 url 引用路径处理
const clean = require('gulp-clean');
const replace = require('gulp-replace');
const changed = require('gulp-changed');
const cheerio = require('gulp-cheerio');
const merge = require('merge-stream');
const webpack = require('webpack');
const { getFolders } = require('./utils');
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
                .pipe(cheerio({
                    run($, file, done) {
                        scriptSrcList = [];
                        $('script').each(function() {
                            let $script = $(this),
                                reg = /^(\.\/|\.\.\/|\/)[\W\w\s]+$/g,
                                src = $script.attr('src');
                            if (reg.test(src)) scriptSrcList.push(src);
                        });
                        done()
                    },
                    parserOptions: {
                        decodeEntities: false
                    }
                })),

            gulp.src(`${srcPath}**/*.html`)
                .pipe(changed(`${devPath}`))
                .pipe(cheerio({
                    run($, file, done) {
                        let $body = $('body');
                        scriptSrcList.forEach(item => {
                            $body.append(`<script type="text/javascript" src="${item}"></script>`);
                        });
                        scriptSrcList = [];
                        done()
                    },
                    parserOptions: {
                        // 不加这个cheerio会转换html实体
                        decodeEntities: false
                    }
                }))
                .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${stylePath.outputFolder}/$2$3`))
                .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${imagesPath}$2$3$4`))
                .pipe(gulp.dest(`${devPath}`))
        )
        return merge(tasks);
    });
    // 模板文件同步
    gulp.task(TASK.DEV.RUNTIME_FILE_SYNC, [TASK.DEV.RUNTIME_HTML], () => {
        gulp.src([`${devPath}**/*.html`, `!${runTimePath.dev}**/*.html`])
            .pipe(gulp.dest(`${runTimePath.dev}`))
    })


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
    gulp.task(TASK.DEV.RUNTIME_SCRIPT_CLEAN, () => {
        let tasks = [];
        tasks.push(
            gulp.src([`${devPath}${scriptPath.root}`], {read: false})
                .pipe(clean()),

            gulp.src(`${runTimePath.dev}**/*.html`)
                .pipe(replace(/<script.*src=["'](\.\.\/|\.\/|\/)[\W\w\s]+["'].*><\/script>/g, ''))
                .pipe(gulp.dest(`${runTimePath.dev}`))
        );
        return merge(tasks);
    });
    gulp.task(TASK.DEV.RUNTIME_SCRIPT.MAIN, [ TASK.DEV.RUNTIME_SCRIPT_CLEAN ], () => {
        webpack(require('./webpack.dev.conf.js'), (err, stats) => {
            if (err != null) console.log('webpack bundle script error, information: ', err);
            // 完成之后将 build 里的模板文件重输出到temp目录，保证两个目录的文件统一
            gulp.src([`${devPath}**/*.html`, `!${runTimePath.dev}**/*.html`])
                .pipe(gulp.dest(`${runTimePath.dev}`));
            browserSync.reload();
        });
    });



    // image 任务
    gulp.task(TASK.DEV.RUNTIME_IMAGE.MAIN, () => {
        // 检测对应搜索路径下的文件夹
        let folders = getFolders(`${srcPath}${imagesPath}`),
            tasks = [];
        // 先检测 static/images/ 下的文件
        tasks.push(
            gulp.src([ `${devPath}${imagesPath}` ], {read: false})
                .pipe(clean()),

            gulp.src(`${srcPath}${imagesPath}*.*`)
                .pipe(imagemin())
                .pipe(gulp.dest(`${devPath}${imagesPath}`))
        );
        // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
        if (folders.length > 0) {
            let taskList = folders.map(folder => gulp.src(path.join(`${srcPath}${imagesPath}`, folder, '/*.*')).pipe(imagemin()).pipe(gulp.dest(`${devPath}${imagesPath}`)));
            tasks.push(...taskList);
        }
        return merge(tasks);
    });

};