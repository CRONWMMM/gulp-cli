/**
 *
 * author: CRONWMMM
 * github: https://github.com/CRONWMMM
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
const spriter = require('gulp-css-spriter');                // 雪碧图

/* html文件处理 -------------------------------------------------------------------------------------------- */
const htmlmin = require('gulp-htmlmin');


/* 样式文件处理 --------------------------------------------------------------------------------------------- */
const cssmin = require('gulp-cssmin');                      // css压缩
const cleanCss = require('gulp-clean-css');
const px3rem = require("gulp-px3rem");                      // rem单位转换
const sass = require('gulp-sass');                          // 处理sass
const autoPrefixer = require('gulp-autoprefixer');          // css样式自动加前缀
const modifyCssUrls = require('gulp-modify-css-urls');      // css 文件中 url 引用路径处理

/* 脚本文件处理 -------------------------------------------------------------------------------------------- */
const babel = require('gulp-babel');                        // babel 使用方法：http://blog.csdn.net/qq243541844/article/details/51999901
const browserify = require('browserify');                   // babel编译完之后使用了CommonJs的require语法来引用外部模块，所以需要再用browserify做一层转译
// const jshint = require('gulp-jshint');                   // jshint
const uglify = require('gulp-uglify');                      // 混淆工具
const concat = require('gulp-concat');                      // js文件合并


/* 文件清除 ------------------------------------------------------------------------------------------------- */
const clean = require('gulp-clean');


/* sourcemap ---------------------------------------------------------------------------------------------- */
const sourcemaps = require('gulp-sourcemaps');

/* server服务 ---------------------------------------------------------------------------------------------- */
const connect = require('gulp-connect');                    // 静态web的服务
const nodemon = require('gulp-nodemon');                    // nodemon，启动node服务

/* 热更新 -------------------------------------------------------------------------------------------------- */
const browserSync = require('browser-sync');


/* 辅助模块 ------------------------------------------------------------------------------------------------ */
const replace = require('gulp-replace');                    // 替换指定文件的指定内容，https://www.npmjs.com/package/gulp-replace
const changed = require('gulp-changed');                    // 用来过滤未被修改过的文件，只有修改后的文件才能通过管道，在src和dest内容为统一目录下的时候可能有用
const cheerio = require('cheerio');
const watchify = require('watchify');
const merge = require('merge-stream');                      // 流处理
const webpack = require('webpack');                         // webpack
const open = require('open');                               // 打开浏览器

/* 配置文件 ------------------------------------------------------------------------------------------------ */
const { CONTROL_CONFIG, PATH_CONFIG, TASK, ROUTES, AUTO_PREFIXER_CONFIG, BASE64_CONFIG, MODIFY_CSS_URLS_CONFIG } = require('./gulpfile.config');
const { serverPath, srcPath, devPath, prdPath, stylePath, scriptPath, imagesPath, revPath, tempPath } = PATH_CONFIG;


// gulp不同环境命令，写在script里面
// gulp serve --env production
// gulp serve --env development 默认是development环境下





/* 生产环境 ----------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* clean 文件清除任务 */
gulp.task(TASK.BUILD.CLEAN, () => {
    return gulp.src([prdPath, revPath.root], {read: false})
        .pipe(clean());
});


/* style 任务 */
gulp.task(TASK.BUILD.STYLE.SASS, [TASK.BUILD.CLEAN], () => {
    return gulp.src(`${srcPath}${stylePath.sassEntry}`)
        .pipe(sass().on('error', sass.logError))  // sass 文件编译
        .pipe(base64(BASE64_CONFIG.BUILD))  // base64压缩小图片
        .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.BUILD)) // 替换 css 样式文件中的 url 地址
        .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.BUILD)) // css 样式前缀
        .pipe(cssmin()) // css 压缩
        .pipe(rev())    // 装填生产环境之前先对文件名加md5后缀，防止本地缓存
        .pipe(gulp.dest(`${prdPath}${stylePath.outputFolder}`))
        .pipe(rev.manifest(`${revPath.fileName.css}`, {}))   // 生成JSON的映射表
        .pipe(gulp.dest(`${revPath.root}`));  // 装填JSON映射表
});
// 通过样式映射表修改html文件上引用的css文件路径
gulp.task(TASK.BUILD.STYLE.MANIFEST, [TASK.BUILD.STYLE.SASS], () => {
    return gulp.src([`${revPath.root}**/*.json`, `${srcPath}**/*.html`])
        .pipe(revCollector())   // 替换静态资源MD5文件名
        // 替换link文件的href引用地址
        .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${stylePath.outputFolder}/$2$3`))
        // 替换除了script文件的其他src资源引用地址
        // 图片资源
        .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${imagesPath}$2$3$4`))
        // 视音频资源后面再加
        .pipe(gulp.dest(`${tempPath.build}`));    // 将替换后的html文件装填到新目录
});

/* JS 任务 */
/* 第一版，用gulp-babel编译ES6语法，但由于编译出来的是commonJS模块，浏览器不能解析。 */
/* 第二版，用browserify，打包出来的文件太大。*/
/* 第三版，采用webpack构建模块化JS文件，貌似成功了 */
gulp.task(TASK.BUILD.SCRIPT.MAIN, [TASK.BUILD.STYLE.MANIFEST], () => {
    webpack(require('./webpack.prod.conf.js'), (err, stats) => {});
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
    tasks.push(gulp.src(`${srcPath}${imagesPath}*.*`).pipe(imagemin()).pipe(gulp.dest(`${prdPath}${imagesPath}`)));
    // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
    if (folders.length > 0) {
        let taskList = folders.map(folder => gulp.src(path.join(`${srcPath}${imagesPath}`, folder, '/*.*')).pipe(imagemin()).pipe(gulp.dest(`${prdPath}${imagesPath}`)));
        tasks.push(...taskList);
    }
    return merge(tasks);
});




/* build 合并构建任务 */
gulp.task(TASK.BUILD.MAIN, [TASK.BUILD.CLEAN, TASK.BUILD.STYLE.SASS, TASK.BUILD.STYLE.MANIFEST, TASK.BUILD.SCRIPT.MAIN, TASK.BUILD.IMAGE.MAIN], () => {
    gulp.src([tempPath.build], {read: false})
        .pipe(clean());
});





















/* 开发环境 ----------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* clean 文件清除任务 */
gulp.task(TASK.DEV.CLEAN, () => {
    return gulp.src([devPath], {read: false})
        .pipe(clean());
});




/* style 任务 */
gulp.task(TASK.DEV.STYLE.SASS, [TASK.DEV.CLEAN], () => {
    return gulp.src(`${srcPath}${stylePath.sassEntry}`)
        .pipe(sass().on('error', sass.logError))  // sass 文件编译
        .pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
        .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.DEV))   // css 样式前缀
        .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.DEV)) // 替换 css 样式文件中的 url 地址
        .pipe(gulp.dest(`${devPath}${stylePath.outputFolder}`));
});

/* style 任务 */
// 修改html文件上引用的 css 文件路径和 src 静态资源路径
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



/* JS 任务，还少了一个source-map，后面补充 */
gulp.task(TASK.DEV.SCRIPT.MAIN, [TASK.DEV.HTML], () => {
    webpack(require('./webpack.dev.conf.js'), (err, stats) => {});
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


/* 启动 server 任务 */
// 启动NodeJS服务文件
gulp.task(TASK.DEV.NODEMON, (cb) => {
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
    return browserSync.init({
        notify: false,//关闭页面通知
        proxy: ROUTES.PROXY,
        files: ["src/views/**/*.*","src/public/scss/*.*","src/public/js/*.*","src/public/images/*.*"],
        browser: "chrome",
        port: ROUTES.PORT
    });
});



/* watch 监听任务 */
gulp.task(TASK.DEV.WATCH, [TASK.DEV.NODEMON], () => {
    return gulp.watch(`${config.srcPath}sass/**/*.scss`, ['sass']);
});



/* dev 合并构建任务 */
gulp.task(TASK.DEV.MAIN, [TASK.DEV.CLEAN, TASK.DEV.STYLE.SASS, TASK.DEV.SCRIPT.MAIN, TASK.DEV.IMAGE.MAIN, TASK.DEV.NODEMON, TASK.DEV.BROWSER_SYNC], () => {
    gulp.src([tempPath.dev], {read: false})
        .pipe(clean());
});




/* utils */
function getFolders(dir) {
    return fs.readdirSync(dir).filter(file => {
        return fs.statSync(path.join(dir, file)).isDirectory();
    })
}