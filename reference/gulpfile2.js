const gulp = require('gulp');
// const $ = require('gulp-load-plugins')();
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');

const config = {
	serverPath: 'server/',		// 服务
	libPath: '',				// 依赖
	srcPath: 'src/',			// 源码
	devPath: 'build/',			// 生产
	prdPath: 'dist/'			// 发布
};


gulp.task('clean', () => {
	return gulp.src([config.devPath, config.prdPath], {read: false})
				.pipe(clean())
});

gulp.task('js', ['clean'], () => {
	return gulp.src(`${config.srcPath}js/**/*.js`)
				.pipe(uglify())
				.pipe(rev())
				.pipe(gulp.dest(`${config.devPath}js`))
				.pipe(gulp.dest(`${config.prdPath}js`))
				.pipe(rev.manifest())
				.pipe(gulp.dest('rev/js'));
});

gulp.task('sass', ['js'], () => {
	return gulp.src(`${config.srcPath}sass/**/*.scss`)
				.pipe(sass().on('error', sass.logError))
        		.pipe(cssmin())
        		.pipe(gulp.dest(`${config.srcPath}css`))
				.pipe(rev())
        		.pipe(gulp.dest(`${config.devPath}css`))
				.pipe(gulp.dest(`${config.prdPath}css`))
				.pipe(rev.manifest())
				.pipe(gulp.dest('rev/css'));

});

gulp.task('html', ['clean', 'js', 'sass'], () => {
	return gulp.src(['rev/**/*.json', `${config.srcPath}views/*.html`])
				.pipe(revCollector())
				.pipe(gulp.dest(`${config.devPath}views`))
				.pipe(gulp.dest(`${config.prdPath}views`));
});

gulp.task('build', ['clean', 'js', 'sass', 'html'], () => {});


// server
gulp.task('nodemon', (cb) => {
	let started = false;
	return nodemon({
		script: `${config.serverPath}server.js`
	}).on('start', () => {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
	});
});

gulp.task('watch', ['nodemon'], () => {
	return gulp.watch(`${config.srcPath}sass/**/*.scss`, ['sass']);
})

gulp.task('server', ['watch'], () => {

    return browserSync.init({
        notify: false,					//关闭页面通知
        proxy: "http://localhost:8088",
		port: 8888,
        files: ['**']
	});
});