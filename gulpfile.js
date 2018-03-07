/**
 *
 * author: CRONWMMM
 * 
 * 
 * 相关参考文件：
 *
 * 1.https://segmentfault.com/a/1190000004915222 	【Gulp资料大全 入门、插件、脚手架、包清单】
 * 2.https://segmentfault.com/a/1190000009467932 	【Gulp.src排除一些文件的路径规则】
 * 3.https://csspod.com/using-browserify-with-gulp/	【在 Gulp 中使用 Browserify】
 * 4.https://segmentfault.com/a/1190000004917668	【基于 Gulp + Browserify 构建 ES6 环境下的自动化前端项目】
 *
 *
 *
 *
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
const pump = require('pump');								// 任务流处理，详见 https://github.com/mafintosh/pump
const globby = require('globby');							// 似乎是类似于gulp的一种生成任务流的模块，gulp-babel + browserify 编译ES6时使用
const through2 = require('through2');						// 同上
const source = require('vinyl-source-stream');				// 将常规流转换为包含 Stream 的 vinyl 对象
const buffer = require('vinyl-buffer');						// 将 vinyl 对象内容中的 Stream 转换为 Buffer。
const watchify = require('watchify');
const standalonify = require('standalonify');				// browserify插件，作用就是通用模块解析器【支持AMD/CMD】
const babelify = require('babelify');
// const open = require('open');							// 打开浏览器







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
		mainEntry: ''
	},
	revPath: {												// 随机文件名后生成的映射JSON地址，代表根路径开始的绝对路径（不使用随机文件名的情况下改配置不生效）
		fileName: 'rev-manifest.json',						// 生成的rev映射文件名
		root: 'rev/',										// 根目录
		jsrev: 'rev/jsrev',
		cssrev: 'rev/cssrev'
	}
};
const TASK = {
	CLEAN: 'clean',
	BUILD: 'build',
	HTML: 'html',
	SERVER: 'server',
	WATCH: 'watch',
	STYLE: {
		main: 'css',
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







const { serverPath, srcPath, devPath, prdPath, stylePath, revPath } = PATH_CONFIG;


/* build 文件打包任务 ------------------------------------------------------------------------------------- */
gulp.task(TASK.BUILD, () => {});




/* clean 文件清除任务 ------------------------------------------------------------------------------------- */
gulp.task(TASK.CLEAN, () => {
	return gulp.src([], {read: false})
			   .pipe(clean());
});




/* style 任务 --------------------------------------------------------------------------------------------- */
gulp.task(TASK.STYLE.sass, [TASK.CLEAN], () => {
	return gulp.src(`${srcPath}${stylePath.sassEntry}`)
			   .pipe(sass().on('error', sass.logError))
			   .pipe(gulp.dest(`${devPath}${stylePath.outputFolder}`))
});

gulp.task(TASK.STYLE.main, [TASK.STYLE.sass], () => {
	return gulp.src(`${devPath}**/*.css`)
			   .pipe(cssmin())
			   .pipe(rev())	// 装填生产环境之前先对文件名加md5后缀，防止本地缓存
			   .pipe(gulp.dest(`${prdPath}`))
			   .pipe(rev.manifest(revPath.fileName))	// 生成JSON的映射表
			   .pipe(gulp.dest(`${revPath.cssrev}`))	// 装填JSON映射表
});





/* JS 任务 ------------------------------------------------------------------------------------------------ */
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
			'transform-runtime'
		]
    }).bundle()  //合并打包
	.pipe(source('vendors.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest(`${devPath}`));
	
});




/* html 任务 ---------------------------------------------------------------------------------------------- */
gulp.task(TASK.HTML, [TASK.STYLE.main, TASK.SCRIPT.main], () => {
	// 这块有坑，分两步，先生成一份html文件到生产环境，开发环境需要rev映射文件名的另写，如果把复制html文件到生产环境的操作
	// 和开发环境混写，会生成无用的rev映射
	gulp.src(`${srcPath}**/*.html`)
		.pipe(gulp.dest(`${devPath}`));	// 开发环境就不需要MD5随机文件名了

	gulp.src([`${revPath.root}**/*.json`, `${srcPath}**/*.html`])
		.pipe(revCollector())	// 替换静态资源MD5文件名
		.pipe(gulp.dest(`${prdPath}`));	// 装填到生产目录
});




/* watch 监听任务 ----------------------------------------------------------------------------------------- */
gulp.task(TASK.WATCH, () => {});





/* 启动 server 任务 --------------------------------------------------------------------------------------- */
gulp.task(TASK.SERVER, () => {});