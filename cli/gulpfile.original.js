/**
 * Created by CRONWMMM on 2018/3/29.
 */


/**
 *
 * author: CRONWMMM
 * github: https://github.com/CRONWMMM
 *
 *
 * gulp-cli 原始文件（注释版本）
 *
 *
 * 项目介绍：
 *   目前的SPA应用基本都有框架自带的一套脚手架工具自动生成，但是对于非SPA应用这种构建工具就很稀缺，
 * 就算有的那些个人感觉并不好用，主要是对 ES6/7语法/模块化 的支持程度并不好，无法使用原生的ES6和
 * import静态编译。针对这一现状，我写了一套 gulp + webpack 自动构建工具，主要针对那些非 SPA的
 * 应用构建。
 *
 * 功能介绍：
 * 1.将 gulp 任务流以配置文件的形式提取出来，尽量最大范围实现灵活可配置性。
 * 2.相比于网上别的开源 gulp 脚手架，实现了对 ES6 写法的全面支持，无论是 语法、API 还是 import
 *   模块化引用，目前可能并未支持ES7，后面可以加上，包括ESlint检查工具 和单元测试，后面也可以加上。
 * 3.由于实现了ES6模块静态编译，所有libs全是从node_modules里找的，所以不需要用到bower。
 * 4.所有js的入口文件在webpack文件里配置完成以后，不需要在 html 页面里声明，webpack会自动inject
 * 5.样式文件可同时支持 css/sass/less/stylus 等写法，在配置文件中定义即可。
 * 6.autoPrefixer自动补全样式前缀。
 * 7.样式文件、脚本文件等静态资源均通过md5重命名，防止浏览器缓存
 * 8.更方便的 link-href img-src background-imageURL 等路径地址配置，只要在项目中写资源名称，
 *   例如 index.css  logo.jpg  脚手架会根据配置文件自动补全路径，如果是网络资源，正常写 http://
 *   开头的绝对路径即可。
 *
 *
 * 相关参考文件：
 *
 * 1.https://www.jianshu.com/p/9723ca2a2afd                             【gulp 入门】
 * 2.http://www.ydcss.com/archives/424                                  【gulp教程之gulp中文API】
 * 3.https://segmentfault.com/a/1190000004915222                        【Gulp资料大全 入门、插件、脚手架、包清单】
 * 4.https://segmentfault.com/a/1190000009467932                        【Gulp.src排除一些文件的路径规则】
 * 5.https://csspod.com/using-browserify-with-gulp/                     【在 Gulp 中使用 Browserify】
 * 6.https://segmentfault.com/a/1190000004917668                        【基于 Gulp + Browserify 构建 ES6 环境下的自动化前端项目】
 * 7.http://blog.csdn.net/yummy_go/article/details/51144506             【gulp前端构建工具知识点及深析】
 * 8.https://www.jianshu.com/p/9724c47b406c                             【gulp & webpack整合】
 * 9.https://www.npmjs.com/package/gulp-webpack                         【gulp-webpack npm介绍】
 * 10.https://www.cnblogs.com/maskmtj/archive/2016/07/21/5597307.html    【gulp + webpack构建配置】
 * 12.http://blog.csdn.net/xiangzhihong8/article/details/53993980       【gulp + webpack 工具整合介绍】
 * 13.http://blog.csdn.net/qq_16559905/article/details/79404173         【Webpack 3.X - 4.X 升级记录】
 * 14.https://www.cnblogs.com/wonyun/p/6030090.html                     【html-webpack-plugin详解】
 * 15.https://segmentfault.com/a/1190000007294861                       【html-webpack-plugin用法全解】
 * 16.http://blog.csdn.net/keliyxyz/article/details/51513114            【webpack入门（六）——html-webpack-plugin】
 * 17.https://segmentfault.com/a/1190000006085774                       【gulp之JS、CSS、HTML、图片压缩以及版本更新】
 * 18.https://github.com/ai/browserslist#queries                        【gulp-autoprefixer的browsers参数详解】
 * 19.https://segmentfault.com/q/1010000004234745?_ea=556298            【各种gulp配置文件】
 * 20.https://www.jianshu.com/p/8ebf9b6aee60                            【替换css 中的 url，解决打包后 background-image 引用图片路径出错问题】
 * 21.https://segmentfault.com/a/1190000006190814?utm_source=weekly&utm_medium=email&utm_campaign=email_weekly#articleHeader0       【教你从零开始搭建一款前端脚手架工具】
 * 22.https://www.jianshu.com/p/038c6b91f667                            【Yeoman，教你快速打造自己的脚手架】
 * 23.https://www.gulpjs.com.cn/docs/recipes/running-task-steps-per-folder/     【gulp每个文件夹生成单独一个文件】
 *
 *
 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');

/* 文件名重命名处理，主要解决文件缓存 -------------------------------------------------------------------------- */
const rev = require('gulp-rev');                            // 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');         // 路径替换

/* 图片处理 ------------------------------------------------------------------------------------------------ */
const imagemin = require('gulp-imagemin');                  // 图片压缩
const base64 = require('gulp-base64');                      // base64
// const spriter = require('gulp-css-spriter');             // 雪碧图

/* html文件处理 -------------------------------------------------------------------------------------------- */
const htmlmin = require('gulp-htmlmin');


/* 样式文件处理 --------------------------------------------------------------------------------------------- */
const cssmin = require('gulp-cssmin');                      // css压缩
// const cleanCss = require('gulp-clean-css');
// const px3rem = require("gulp-px3rem");                   // rem单位转换，如果是做移动页面可以开启
const sass = require('gulp-sass');                          // 处理sass
const autoPrefixer = require('gulp-autoprefixer');          // css样式自动加前缀
const modifyCssUrls = require('gulp-modify-css-urls');      // css 文件中 url 引用路径处理

/* 脚本文件处理 -------------------------------------------------------------------------------------------- */
// 下面几种脚本文件处理依赖是早期写的，后来直接用webpack打包JS，这些就用不到了
// const babel = require('gulp-babel');                     // babel 使用方法：http://blog.csdn.net/qq243541844/article/details/51999901
// const browserify = require('browserify');                // babel编译完之后使用了CommonJs的require语法来引用外部模块，所以需要再用browserify做一层转译
// const uglify = require('gulp-uglify');                   // 混淆工具
// const concat = require('gulp-concat');                   // js文件合并


/* 代码校验 ------------------------------------------------------------------------------------------------- */
// const jshint = require('gulp-jshint');                   // jshint


/* 文件清除 ------------------------------------------------------------------------------------------------- */
const clean = require('gulp-clean');


/* sourcemap ---------------------------------------------------------------------------------------------- */
const sourcemaps = require('gulp-sourcemaps');

/* server服务 ---------------------------------------------------------------------------------------------- */
// const connect = require('gulp-connect');                 // 静态web的服务
const webServer = require('gulp-webserver');
const nodemon = require('gulp-nodemon');                    // nodemon，启动node服务

/* 热更新 -------------------------------------------------------------------------------------------------- */
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

/* 错误处理 ------------------------------------------------------------------------------------------------ */
const plumber = require('gulp-plumber');                    // 使用gulp-plumber来捕获处理任务中的错误


/* 辅助模块 ------------------------------------------------------------------------------------------------ */
const replace = require('gulp-replace');                    // 替换指定文件的指定内容，https://www.npmjs.com/package/gulp-replace
const changed = require('gulp-changed');                    // 用来过滤未被修改过的文件，只有修改后的文件才能通过管道，在src和dest内容为统一目录下的时候可能有用
// const glob = require('glob');
// const cheerio = require('cheerio');
const cheerio = require('gulp-cheerio');
// const watchify = require('watchify');
const merge = require('merge-stream');                      // 流处理
const webpack = require('webpack');                         // webpack
// const open = require('open');                            // 打开浏览器


/* utils -------------------------------------------------------------------------------------------------- */
const { getFolders } = require('./cli/utils');

/* 配置文件 ------------------------------------------------------------------------------------------------ */
const { CONTROL_CONFIG, PATH_CONFIG, TASK, ROUTES, AUTO_PREFIXER_CONFIG, BASE64_CONFIG, MODIFY_CSS_URLS_CONFIG } = require('./cli/gulpfile.config');
const { serverPath, srcPath, devPath, prodPath, stylePath, scriptPath, imagesPath, revPath, runTimePath, templatePath } = PATH_CONFIG;


// gulp不同环境命令，写在script里面
// gulp serve --env production
// gulp serve --env development 默认是development环境下





/* 生产环境 ----------------------------------------------------------------------------------------------------------------------------------------------------------- */
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
/* 第一版，用gulp-babel编译ES6语法，但由于编译出来的是commonJS模块，浏览器不能解析。 */
/* 第二版，用browserify，打包出来的文件太大。*/
/* 第三版，采用webpack构建模块化JS文件，貌似成功了 */
gulp.task(TASK.BUILD.SCRIPT.MAIN, [TASK.BUILD.HTML], () => {
    webpack(require('./cli/webpack.prod.conf.js'), (err, stats) => {});
});


/* image 任务 */
// 这块需要做一个文件抽取，就是将 static/images/**/* 里不同层级文件夹内的文件抽出来，统一放到一个最后指定的文件夹里
// 静态资源的文件夹嵌套最多允许两层，也就是说最多能探到 static/images/header/logo.jpg 这种层级的文件
// 再往下，恕在下无能为力
gulp.task(TASK.BUILD.IMAGE.MAIN, () => {
    // 检测对应搜索路径下的文件夹
    let folders = getFolders(`${srcPath}${imagesPath}`),
        tasks = [];
    // 先检测 static/images/ 下的文件
    tasks.push(gulp.src(`${srcPath}${imagesPath}*.*`).pipe(imagemin({
        progressive: true,// 无损压缩JPG图片
        svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
    })).pipe(gulp.dest(`${prodPath}${imagesPath}`)));
    // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
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











/* 开发环境 (初始 npm run dev) ----------------------------------------------------------------------------------------------------------------------------------------------------------- */

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
// 修改html文件上引用的 css 文件路径和 src 静态资源路径
gulp.task(TASK.DEV.HTML, [TASK.DEV.STYLE.SASS], () => {
    return gulp.src(`${srcPath}**/*.html`)
    // 替换link文件的href引用地址
        .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${stylePath.outputFolder}/$2$3`))
        // 替换除了script文件的其他src资源引用地址
        // 图片资源
        .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${imagesPath}$2$3$4`))
        // 视音频资源后面再加
        .pipe(gulp.dest(`${runTimePath.dev}`));    // 将替换后的html文件装填到新目录
});



/* JS 任务 */
gulp.task(TASK.DEV.SCRIPT.MAIN, [TASK.DEV.HTML], () => {
    webpack(require('./cli/webpack.dev.conf.js'), (err, status) => {
        if (err != null) console.log('webpack bundle script error, information: ', err);
        // 完成之后将 build 里的模板文件重输出到temp目录，保证两个目录的文件统一
        gulp.src(`${devPath}**/*.html`)
            .pipe(gulp.dest(`${runTimePath.dev}`));
    });
});



/* image 任务 */
gulp.task(TASK.DEV.IMAGE.MAIN, [TASK.DEV.SCRIPT.MAIN], () => {
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
gulp.task(TASK.DEV.MAIN, [TASK.DEV.CLEAN.ALL, TASK.DEV.STYLE.SASS, TASK.DEV.HTML, TASK.DEV.SCRIPT.MAIN, TASK.DEV.IMAGE.MAIN, TASK.DEV.NODEMON, TASK.DEV.BROWSER_SYNC], () => {
    // gulp.src([runTimePath.dev], {read: false})
    //     .pipe(clean());
});




/* watch 文件文件改变执行的分任务 --------------------------------------------------------------------------------------------------------------------------------------------------------- */

// html 任务
gulp.task(TASK.DEV.RUNTIME_HTML, () => {
    let tasks = [],
        scriptSrcList = [];
    // 由于script标签其实是在webpack里inject的，所以srcPath 下的模板文件里并没有对应的脚本引用
    // 所以要从tempPath下的脚本文件里先拿脚本引用，再和srcPath下修改过的文件合并后，插入到build目录下
    // 这个性能最高的一种方法，不然要重新用webpack打包在inject 浪费性能
    tasks.push(
        gulp.src(`${runTimePath.dev}**/*.html`)
            .pipe(cheerio(($, file) => {
                // 这块也是必要的，和merge-script的流处理机制有关
                // 这个处理机制并不是将所有html文件全部读完再走到下一个流程，
                // 而是限度一个文件，读完之后到下一个流程，然后一套走完再回来循环下一个文件
                // 所以每次拿新的scriptSrcList之前需要清空数据，从而保证每一次的script数据都是当前正在处理文件的
                // 从而避免了将其他页面的引用文件多次打包的情况。
                scriptSrcList = [];
                $('script').each(function() {
                    // 这块有坑，注意不能写成箭头函数，不然this是无法绑定的
                    let $script = $(this),
                        reg = /^(\.\/|\.\.\/|\/)[\W\w\s]+$/g,
                        src = $script.attr('src');
                    if (reg.test(src)) scriptSrcList.push(src);
                });
            })),

        gulp.src(`${srcPath}**/*.html`)
        // 这块是关键，修改过的文件才能放行
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
        // 清除原来的build/css下的样式文件
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
        // 清空 js 目录下的脚本文件
        gulp.src([`${devPath}${scriptPath.root}`], {read: false})
            .pipe(clean()),

        // 删除temp目录下的script引用
        gulp.src(`${runTimePath.dev}**/*.html`)
             // .*部分是为了匹配 type="text/javascript" ，剔除了cdn引用之外的本地引用全部清空，留给webpack自动inject
            .pipe(replace(/<script.*src=["'](\.\.\/|\.\/|\/)[\W\w\s]+["'].*><\/script>/g, ''))
            .pipe(gulp.dest(`${runTimePath.dev}`))
    );
    return merge(tasks);
});
gulp.task(TASK.DEV.RUNTIME_SCRIPT.MAIN, [ TASK.DEV.CLEAN.SCRIPT ], () => {
    webpack(require('./cli/webpack.dev.conf.js'), (err, stats) => {
        browserSync.reload();
    });
});


/* image 任务 */
gulp.task(TASK.DEV.RUNTIME_IMAGE.MAIN, () => {
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








/* 启动 server 任务 --------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
// 启动NodeJS服务文件
gulp.task(TASK.DEV.NODEMON, [TASK.DEV.CLEAN.ALL, TASK.DEV.STYLE.SASS, TASK.DEV.HTML, TASK.DEV.SCRIPT.MAIN, TASK.DEV.IMAGE.MAIN], (cb) => {
    let started = false;
    return nodemon({
        script: 'server.js'
    }).on('start', () => {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
});

// 浏览器同步，用7000端口去代理Express的3008端口
gulp.task(TASK.DEV.BROWSER_SYNC, [TASK.DEV.NODEMON], function() {
    browserSync.init({
        notify: false,  // 是否开启页面通知，true 开启，false 关闭
        proxy: ROUTES.PROXY,
        // files: ["src/views/**/*.*","src/public/scss/*.*","src/public/js/*.*","src/public/images/*.*"],
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
    gulp.watch(`${srcPath}${imagesPath}**/*`, [ TASK.DEV.RUNTIME_IMAGE.MAIN ]).on('change', reload);
});



