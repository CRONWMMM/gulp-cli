/**
 *
 * author: CRONWMMM
 * github: https://github.com/CRONWMMM
 *
 * 相关参考文件：
 *
 * 1.https://www.jianshu.com/p/9723ca2a2afd								【gulp 入门】
 * 2.https://segmentfault.com/a/1190000004915222 						【Gulp资料大全 入门、插件、脚手架、包清单】
 * 3.https://segmentfault.com/a/1190000009467932 						【Gulp.src排除一些文件的路径规则】
 * 4.https://csspod.com/using-browserify-with-gulp/						【在 Gulp 中使用 Browserify】
 * 5.https://segmentfault.com/a/1190000004917668						【基于 Gulp + Browserify 构建 ES6 环境下的自动化前端项目】
 * 6.http://blog.csdn.net/yummy_go/article/details/51144506				【gulp前端构建工具知识点及深析】
 * 7.https://www.jianshu.com/p/9724c47b406c								【gulp & webpack整合】
 * 8.https://www.npmjs.com/package/gulp-webpack							【gulp-webpack npm介绍】
 * 9.https://www.cnblogs.com/maskmtj/archive/2016/07/21/5597307.html 	【gulp + webpack构建配置】
 * 10.http://blog.csdn.net/xiangzhihong8/article/details/53993980		【gulp + webpack 工具整合介绍】
 * 11.http://blog.csdn.net/qq_16559905/article/details/79404173			【Webpack 3.X - 4.X 升级记录】
 * 12.https://www.cnblogs.com/wonyun/p/6030090.html 					【html-webpack-plugin详解】
 * 13.https://segmentfault.com/a/1190000007294861						【html-webpack-plugin用法全解】
 * 14.http://blog.csdn.net/keliyxyz/article/details/51513114			【webpack入门（六）——html-webpack-plugin】
 * 15.https://segmentfault.com/a/1190000006085774						【gulp之JS、CSS、HTML、图片压缩以及版本更新】
 *
 */


const gulp = require('gulp');

/* 文件名重命名处理，主要解决文件缓存 ---------------------------------------------------------------------- */
const rev = require('gulp-rev');							// 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');         // 路径替换

/* 图片处理 ------------------------------------------------------------------------------------------------ */
const imagemin = require('gulp-imagemin');					// 图片压缩
const base64 = require('gulp-base64');						// base64
const spriter = require('gulp-css-spriter'); 			 	// 雪碧图

/* html文件处理 -------------------------------------------------------------------------------------------- */
const htmlmin = require('gulp-htmlmin');


/* 样式文件处理 -------------------------------------------------------------------------------------------- */
const cssmin = require('gulp-cssmin');						// css压缩
const cleanCss = require('gulp-clean-css');
const px3rem = require("gulp-px3rem");						// rem单位转换
const sass = require('gulp-sass');							// 处理sass


/* 脚本文件处理 -------------------------------------------------------------------------------------------- */
const babel = require('gulp-babel');						// babel 使用方法：http://blog.csdn.net/qq243541844/article/details/51999901
const browserify = require('browserify');					// babel编译完之后使用了CommonJs的require语法来引用外部模块，所以需要再用browserify做一层转译
// const jshint = require('gulp-jshint');					// jshint
const uglify = require('gulp-uglify');						// 混淆工具
const concat = require('gulp-concat');						// js文件合并


/* 文件清除 ------------------------------------------------------------------------------------------------ */
const clean = require('gulp-clean');


/* sourcemap ----------------------------------------------------------------------------------------------- */
const sourcemaps = require('gulp-sourcemaps');

/* server服务 ---------------------------------------------------------------------------------------------- */
const connect = require('gulp-connect');					// 静态web的服务
const nodemon = require('gulp-nodemon');					// nodemon，启动node服务

/* 热更新 -------------------------------------------------------------------------------------------------- */
const browserSync = require('browser-sync');


/* 辅助模块 ------------------------------------------------------------------------------------------------ */
const watchify = require('watchify');
const webpack = require('webpack');							// webpack
const open = require('open');								// 打开浏览器







const COMMON_CONFIG = {
    need_dev: true,											// 是否需要使用dev环境/是否需要打包一份build文件夹
    random_file_name: true,									// 是否需要随机文件名
    source_maps: {											// 是否需要生成map映射文件
        js_map: true,
        style_map: true
    }
};
const PATH_CONFIG = {
    serverPath: 'server/',									// 服务路径
    libPath: '',											// 依赖库路径
    srcPath: 'src/',										// 源码路径
    devPath: 'build/',										// 开发环境
    prdPath: 'dist/',										// 生产环境
    stylePath: {
        sassEntry: 'style/sass/index.scss',					// sass入口文件
        lessEntry: 'style/less/index.less',
        stylusEntry: '',
        outputFolder: 'css'									// css的输出文件夹
    },
    scriptPath: {
        mainEntry: 'js/main.js'
    },
    htmlManifestPath: 'temp/',                              // 作为静态css资源映射替换的临时存储文件夹
    revPath: {												// 随机文件名后生成的映射JSON地址，代表根路径开始的绝对路径（不使用随机文件名的情况下改配置不生效）
        fileName: 'rev-manifest.json',						// 生成的rev映射文件名
        root: 'rev/',										// 根目录
        jsrev: 'rev/jsrev',
        cssrev: 'rev/cssrev'
    }
};
const TASK = {
    BUILD: {
        MAIN: 'build',
        CLEAN: 'build-clean',
        HTML: 'build-html',
        STYLE: {
            MAIN: 'build-css',
            SASS: 'build-sass',										// sass编译
            LESS: 'build-less',										// less编译
            STYLUS: 'build-stylus',									// stylus编译
            MANIFEST: 'dev-manifest'
        },
        SCRIPT: {
            MAIN: 'build-js',
            JS_UGLIFY: 'build-uglify',								// JS混淆
            JS_CONCAT: 'build-concat',								// JS文件合并
        }
    },
    DEV: {
        MAIN: 'dev',
        CLEAN: 'dev-clean',
        HTML: 'dev-html',
        STYLE: {
            MAIN: 'dev-css',
            SASS: 'dev-sass',										// sass编译
            LESS: 'dev-less',										// less编译
            STYLUS: 'dev-stylus',									// stylus编译
        },
        SCRIPT: {
            MAIN: 'dev-js',
            JS_UGLIFY: 'dev-uglify',								// JS混淆
            JS_CONCAT: 'dev-concat',								// JS文件合并
        },
        // 服务/页面启动/刷新相关任务名
        SERVER: 'server',										// 服务
        NODEMON: 'nodemon',										// 巡行NodeJS服务器
        BROWSER_SYNC: 'browser-sync',							// 浏览器同步
        WATCH: 'watch',											// 监听
    }
};
const ROUTES = {
    PROXY: 'http://localhost:3000',
    PORT: 7000,
};

const { serverPath, srcPath, devPath, prdPath, stylePath, revPath, scriptPath, htmlManifestPath } = PATH_CONFIG;


// gulp不同环境命令，写在script里面
// gulp serve --env production
// gulp serve --env development	默认是development环境下





/* 生产环境 ----------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* 打包任务 */
gulp.task(TASK.BUILD.MAIN, () => {});

/* clean 文件清除任务 */
gulp.task(TASK.BUILD.CLEAN, () => {
    return gulp.src([prdPath, revPath.root], {read: false})
        .pipe(clean());
});


/* style 任务 */
gulp.task(TASK.BUILD.STYLE.SASS, [TASK.BUILD.CLEAN], () => {
    return gulp.src(`${srcPath}${stylePath.sassEntry}`)
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rev())	// 装填生产环境之前先对文件名加md5后缀，防止本地缓存
        .pipe(gulp.dest(`${prdPath}${stylePath.outputFolder}`))
        .pipe(rev.manifest(revPath.fileName))	// 生成JSON的映射表
        .pipe(gulp.dest(`${revPath.cssrev}`));	// 装填JSON映射表
});
// 通过样式映射表修改html文件上引用的css文件路径
gulp.task(TASK.BUILD.STYLE.MANIFEST, [TASK.BUILD.STYLE.SASS], () => {
    return gulp.src([`${revPath.root}**/*.json`, `${srcPath}**/*.html`])
        .pipe(revCollector())	// 替换静态资源MD5文件名
        .pipe(gulp.dest(`${htmlManifestPath}`));	// 将替换后的html文件装填到新目录，这块暂时没办法在同一个文件夹中更改并生成文件，只能先弄个temp文件夹承接，用完再删除
});

/* JS 任务 */
/* 第一版，用gulp-babel编译ES6语法，但由于编译出来的是CMD模块，浏览器不能解析，遂卒 */
/*
 gulp.task('js', () =>
 gulp.src(`${srcPath}js/entries/vendors.js`)
 .pipe(babel({
 presets: ['env'],
 plugins: ['transform-runtime']
 }))
 .pipe(webpack())
 .pipe(gulp.dest(`${devPath}`))
 );
 */


/* 第二版，用browserify，打包出来的文件贼鸡巴大，你感动吗？我不敢动不敢动。。。
 gulp.task(TASK.SCRIPT.main, [TASK.CLEAN], () => {

 return browserify({
 entries: `${srcPath}js/entries/vendors.js`  //指定打包入口文件
 }).plugin(standalonify, {		 //使打包后的js文件符合UMD规范并指定外部依赖包
 name: 'FlareJ'
 }).transform(babelify, {  //此处babel的各配置项格式与.babelrc文件相同
 presets: [
 'env'
 ],
 plugins: [
 'transform-runtime',
 'external-helpers',  //将es6代码转换后使用的公用函数单独抽出来保存为babelHelpers
 ]
 }).bundle()  //合并打包
 .pipe(source('vendors.js'))
 .pipe(buffer())
 // .pipe(uglify())
 .pipe(gulp.dest(`${devPath}`));

 });
 */

/* 第三版，采用webpack构建模块化JS文件，貌似成功了 */
gulp.task(TASK.BUILD.SCRIPT.MAIN, [TASK.BUILD.STYLE.MANIFEST], () => {
    webpack(require('./webpack.prod.conf.js'), (err, stats) => {});
});

gulp.task(TASK.BUILD.MAIN, [TASK.BUILD.CLEAN, TASK.BUILD.STYLE.SASS, TASK.BUILD.STYLE.MANIFEST, TASK.BUILD.SCRIPT.MAIN], () => {
    // 这块暂时没办法在同一个文件夹中更改并生成文件，只能先弄个temp文件夹承接，用完再删除
    gulp.src([htmlManifestPath], {read: false})
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
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${devPath}${stylePath.outputFolder}`));
});





/* JS 任务，还少了一个source-map，后面补充 */
gulp.task(TASK.DEV.SCRIPT.MAIN, [TASK.DEV.STYLE.SASS], () => {
    webpack(require('./webpack.dev.conf.js'), (err, stats) => {});
});


/* html 任务 */
gulp.task(TASK.DEV.HTML, [TASK.DEV.STYLE.SASS, TASK.DEV.SCRIPT.MAIN], () => {
    // 这块有坑，分两步，先生成一份html文件到生产环境，开发环境需要rev映射文件名的另写，如果把复制html文件到生产环境的操作
    // 和开发环境混写，会生成无用的rev映射
    // 开发环境就不需要MD5随机文件名了
    return gulp.src(`${srcPath}**/*.html`)
        .pipe(gulp.dest(`${devPath}`));
});




/* watch 监听任务 */
gulp.task(TASK.DEV.WATCH, [TASK.DEV.NODEMON], () => {
    return gulp.watch(`${config.srcPath}sass/**/*.scss`, ['sass']);
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
        port: ROUTES.port
    });
});

gulp.task(TASK.DEV.SERVER, () => {});


