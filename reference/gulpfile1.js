const gulp = require('gulp');
const uglify = require('gulp-uglify');
const group = require('gulp-group-files');
const transport = require('gulp-seajs-transport');
const gulpSequence = require('gulp-sequence');
const sass = require('gulp-sass');
const spriter = require('gulp-css-spriter');  //雪碧图
const px3rem = require("gulp-px3rem");
const minifycss = require('gulp-minify-css');
const rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');               //- 路径替换
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync');
const del = require('del');
const nodemon = require('gulp-nodemon');
const concat = require('gulp-concat');
const gulpCopy = require('gulp-file-copy');
const livereload = require('gulp-livereload');
const assetRev = require('gulp-asset-rev');




// 这块主要就是用来处理 require/sea 模块化的，完全可以用ES6+babel代替
var jsFiles = {
    "index" : {
        src: ['src/public/js/a.js','src/public/js/b.js','src/public/js/index.js'],
        dest: "dist/public/js/"
    }
};
gulp.task('mergeScripts',function () {
    return group(jsFiles,function (key,fileset){
        return gulp.src(fileset.src)
            .pipe(transport())  //模块具象化
            .pipe(uglify({//压缩js
             //mangle: true,//类型：Boolean 默认：true 是否修改变量名
             mangle: { except: ['require', 'exports', 'module', '$'] }//排除混淆关键字
             }))
            .pipe(concat(key+'.js'))  //生成js
            .pipe(gulp.dest(fileset.dest));  //生成合并后的js的路径
    })();
});

// copy js组件
gulp.task('js',function(){
     return gulp.src('src/public/js/**/*.js')
         .pipe(uglify())
         .pipe(rev())
         .pipe(gulp.dest('dist/public/js'))
         .pipe(rev.manifest())
         .pipe(gulp.dest('rev/js'));
     /*
    gulp.src('src/public/js/wechart/*.js').pipe(uglify())
        .pipe(gulp.dest('dist/public/js/wechart'));
    return gulp.src('src/public/js/lib/*.js').pipe(uglify())
        .pipe(gulp.dest('dist/public/js/lib'));
    */
});

// copu css
gulp.task('copystylesheets', function() {
    return gulp.src('src/public/stylesheets/*')
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('dist/public/stylesheets/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

gulp.task('mergeScss',function (){
        var timestamp = +new Date();
        del(['dist/public/images/sprite/*','dist/public/css/*']);
        return gulp.src(['src/public/scss/*.scss'])
            .pipe(sass().on('error', sass.logError))
            .pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': 'dist/public/images/sprite/sprite-'+timestamp+'.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../images/sprite/sprite-'+timestamp+'.png'
            }))
            .pipe(px3rem({remUnit: 75 }))//转化基值72，
            .pipe(minifycss())
            .pipe(rev())                                            //- 文件名加MD5后缀
            .pipe(gulp.dest('dist/public/css/'))
            .pipe(base64({
                baseDir: 'dist/public/css/',
                extensions: ['svg', 'png', /\.jpg#datauri$/i],
                exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
                maxImageSize: 20*1024, // bytes
                debug: true
            }))
            .pipe(gulp.dest('dist/public/css/'))
            .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
            .pipe(gulp.dest('rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内
});


gulp.task('scssrev',['mergeScss'],function() {
  return gulp.src( ['rev/*.json','dist/views/*/*.*'])                                    //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
               .pipe(revCollector(
                   {
                    replaceReved: true
                    /*dirReplacements: {
                        '/static/scss': '/build/scss'
                    }*/
                   }
                ))                                   //- 执行文件内css名的替换
               .pipe(gulp.dest("dist/views/"));                     //- 替换后的文件输出的目录
});


// 压缩img
gulp.task('img', function() {
  return gulp.src('src/public/images/**/*')        //引入所有需处理的Img
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))      //压缩图片
    // 如果想对变动过的文件进行压缩，则使用下面一句代码
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/public/images/'))
    // .pipe(notify({ message: '图片处理完成' }));
});
/*
 * 图片base64
 */
gulp.task('base64', function() {
    return gulp.src('dist/public/scss/*')
        .pipe(base64({
            baseDir: 'dist/public/scss/',
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 20*1024, // bytes
            debug: true
        }))
        .pipe(gulp.dest('dist/public/scss'));
});

// 压缩html
gulp.task('ejs', ['js', 'copystylesheets'], function() {
  return gulp.src(['rev/**/*.json','src/views/**/*.*'])
      .pipe(revCollector())
      /*.pipe(htmlmin({collapseWhitespace: true}))*/
      .pipe(gulp.dest('dist/views'));
});



// 浏览器同步，用7000端口去代理Express的3008端口
gulp.task('browser-sync', ['nodemon'], function() {
  return browserSync.init(null, {
    notify: false,//关闭页面通知
    proxy: "http://localhost:3000",
    files: ["src/views/**/*.*","src/public/scss/*.*","src/public/js/*.*","src/public/images/*.*"],
    browser: "chrome",
    port: 7000
  });
});

// 开启Express服务
gulp.task('nodemon', function (cb) {

  var started = false;

  return nodemon({
    script: 'bin/www'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

// 删除文件
gulp.task('clean', function(cb) {
    return del(['dist/public/scss/*','dist/public/js/*','dist/public/images/*','dist/views'], cb)
});


/*
gulp.task('build',['ejs','scssrev','mergeScripts','img','js','copystylesheets'],function () {

});
*/

gulp.task('build', ['mergeScripts','img','js','copystylesheets','ejs'], function () {})

gulp.task('sass', function () {
  return gulp.src('src/public/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/public/css'));
});

gulp.task('server',['browser-sync'],function(){
    gulp.watch('src/public/scss/*.scss', ['sass']);
});
