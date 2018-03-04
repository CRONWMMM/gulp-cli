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
const jshint = require('gulp-jshint');						// jshint
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
const pump = require('pump');								// 任务流处理，详见 https://github.com/mafintosh/pump
// const open = require('open');							// 打开浏览器









const COMMON_CONFIG = {
	need_dev: true,											// 是否需要使用dev环境/是否需要打包一份build文件夹
	source_maps: {											// 是否需要生成map映射文件
		js_map: true,
		style_map: true
	}
};
const PATH_CONFIG = {
	serverPath: 'server/',									// 服务路径
	libPath: '',											// 依赖库路径
	srcPath: 'src/',										// 源码路径
	devPath: 'build',										// 开发环境
	prdPath: 'dist',										// 生产环境
	stylePath: {
		sassEntry: 'style/sass/index.scss'					// sass入口文件
	}
};
const TASK = {
	CLEAN: 'clean',
	BUILD: 'build',
	HTML: 'html',
	SERVER: 'server',
	WATCH: 'watch',
	STYLE: {
		main: 'style',
		sass: 'sass',										// sass编译
		less: 'less',										// less编译
		stylus: 'stylus',									// stylus编译
	},
	SCRIPT: {
		main: 'js',
		jsUglify: 'uglify',									// JS混淆
		jsConcat: 'concat',									// JS文件合并
	}
}










let { serverPath, srcPath, devPath, prdPath, stylePath } = PATH_CONFIG;


/* build 文件打包任务 ------------------------------------------------------------------------------------- */
gulp.task(TASK.BUILD, () => {});

/* clean 文件清除任务 ------------------------------------------------------------------------------------- */
gulp.task(TASK.CLEAN, () => {});

/* html 任务 ---------------------------------------------------------------------------------------------- */
gulp.task(TASK.HTML, () => {
	gulp.src(`${srcPath}**/*.html`)
		.pipe(gulp.dest(`${devPath}`))
		.pipe(gulp.dest(`${prdPath}`));
});

/* style 任务 --------------------------------------------------------------------------------------------- */
gulp.task(TASK.STYLE.main, () => {
	gulp.src(`${srcPath}/${stylePath.sassEntry}`)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(`${devPath}`))
		.pipe(gulp.cssmin())
		.pipe(gulp.dest(`${prdPath}`));
});

/* JS 任务 ------------------------------------------------------------------------------------------------ */
gulp.task(TASK.SCRIPT.main, () => {});

/* watch 监听任务 ----------------------------------------------------------------------------------------- */
gulp.task(TASK.WATCH, () => {});

/* 启动 server 任务 --------------------------------------------------------------------------------------- */
gulp.task(TASK.SERVER, () => {});