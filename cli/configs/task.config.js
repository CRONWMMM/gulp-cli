module.exports = {
    BUILD: 'build',
    BUILD_CLEAN: 'build-clean',
    BUILD_CSS: 'build-css',
    BUILD_SASS: 'build-sass',
    BUILD_MANIFEST: 'build-manifest',
    BUILD_HTML: 'build-html',
    BUILD_JS: 'build-js',
    BUILD_IMAGE: 'build-image',
    BUILD_FONTS: 'build-fonts',

    DEV: {
        MAIN: 'dev',
        CLEAN: {
            MAIN: 'dev-clean',
            SCRIPT: 'dev-clean-script'
        },
        RUNTIME_STYLE_CLEAN: 'dev-runtime-style-clean',
        RUNTIME_SCRIPT_CLEAN: 'dev-runtime-script-clean',
        HTML: 'dev-html',
        RUNTIME_HTML: 'dev-runtime-html',
        RUNTIME_FILE_SYNC: 'dev-runtime-file-sync',
        RUNTIME_FONTS: 'dev-runtime-fonts',
        STYLE: {
            MAIN: 'dev-css',
            CSS: 'dev-css',
            SASS: 'dev-sass',                               // sass编译
            LESS: 'dev-less',                               // less编译
            STYLUS: 'dev-stylus',                           // stylus编译
        },
        SCRIPT: {
            MAIN: 'dev-js',
            JS_UGLIFY: 'dev-uglify',                        // JS混淆
            JS_CONCAT: 'dev-concat',                        // JS文件合并
        },
        IMAGE: {
            MAIN: 'dev-image',
            IMAGE_MIN: 'dev-image-min',
            base64: 'dev-base64'
        },
        FONTS: {
            MAIN: 'dev-fonts'
        },
        RUNTIME_STYLE: {
            MAIN: 'dev-runtime-css',
            SASS: 'dev-runtime-sass',                     // sass编译
            LESS: 'dev-runtime-less',                     // less编译
            STYLUS: 'dev-runtime-stylus',                 // stylus编译
            MANIFEST: 'dev-runtime-manifest'
        },
        RUNTIME_SCRIPT: {
            MAIN: 'dev-runtime-js',
            JS_UGLIFY: 'dev-runtime-uglify',              // JS混淆
            JS_CONCAT: 'dev-runtime-concat',              // JS文件合并
        },
        RUNTIME_IMAGE: {
            MAIN: 'dev-runtime-image',
            IMAGE_MIN: 'dev-runtime-image-min',
            base64: 'dev-runtime-base64'
        },

        // 服务/页面启动/刷新相关任务名
        SERVER: 'server',                                   // 服务
        NODEMON: 'nodemon',                                 // 运行NodeJS服务器
        BROWSER_SYNC: 'browser-sync',                       // 浏览器同步
        WATCH: 'watch',                                     // 监听
    },
    WATCH: {

    }
}