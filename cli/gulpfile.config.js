
const CONTROL_CONFIG = {
    need_dev: true,                                         // 是否需要使用dev环境/是否需要打包一份build文件夹
        random_file_name: true,                                 // 是否需要随机文件名
        source_maps: {                                          // 是否需要生成map映射文件
        js_map: true,
            style_map: true
    }
};
const PATH_CONFIG = {
    serverPath: 'server/',                                  // 服务路径
    libPath: '',                                            // 依赖库路径
    srcPath: 'src/',                                        // 源码路径
    devPath: 'build/',                                      // 开发环境
    prodPath: 'dist/',                                      // 生产环境
    staticPath: 'static/',                                  // 静态资源路径
    imagesPath: 'static/images/',                           // 图片路径
    templatePath: {
        root: 'views/'
    },
    stylePath: {
        sass: {
            root: 'style/sass/',
            entry: 'style/sass/*.scss'                      // sass入口文件
        },
        less: {
            root: 'style/less/',
            entry: 'style/less/*.less',
        },
        stylus: {
            root: 'style/stylus/',
            entry: '',
        },
        outputFolder: 'css'                                 // css的输出文件夹
    },
    scriptPath: {
        root: 'js/',
        mainEntry: 'js/main.js'
    },
    runTimePath: {                                             // 作为静态css资源映射替换的临时存储文件夹
        dev: 'runtime-dev/',
        build: 'runtime-build/'
    },
    revPath: {                                              // 随机文件名后生成的映射JSON地址，代表根路径开始的绝对路径（不使用随机文件名的情况下改配置不生效）
        root: 'rev/',                                       // 根目录
        fileName: {                                         // 生成的rev映射文件名
            css: 'css-manifest.json'
        }
    }
};
const TASK = {
    BUILD: {
        MAIN: 'build',
        CLEAN: 'build-clean',
        HTML: 'build-html',
        STYLE: {
            MAIN: 'build-css',
            SASS: 'build-sass',                             // sass编译
            LESS: 'build-less',                             // less编译
            STYLUS: 'build-stylus',                         // stylus编译
            MANIFEST: 'build-manifest'
        },
        SCRIPT: {
            MAIN: 'build-js',
            JS_UGLIFY: 'build-uglify',                      // JS混淆
            JS_CONCAT: 'build-concat',                      // JS文件合并
        },
        IMAGE: {
            MAIN: 'build-image',
            IMAGE_MIN: 'build-image-min',
            base64: 'build-base64'
        }
    },
    DEV: {
        MAIN: 'dev',
        CLEAN: {
            ALL: 'dev-clean',
            SCRIPT: 'dev-clean-script'
        },
        RUNTIME_STYLE_CLEAN: 'dev-runtime-style-clean',
        RUNTIME_SCRIPT_CLEAN: 'dev-runtime-script-clean',
        HTML: 'dev-html',
        RUNTIME_HTML: 'dev-runtime-html',
        STYLE: {
            MAIN: 'dev-css',
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

        // 服务/页面启动/刷新相关任务名
        SERVER: 'server',                                   // 服务
        NODEMON: 'nodemon',                                 // 运行NodeJS服务器
        BROWSER_SYNC: 'browser-sync',                       // 浏览器同步
        WATCH: 'watch',                                     // 监听
    }
};
const ROUTES = {
    PROXY: 'http://localhost:8000',
    PORT: 8088,
};
const AUTO_PREFIXER_CONFIG = {                              // gulp-autoprefixer 配置文件
    DEV: {
        browsers: ['last 2 versions', 'Android >= 4.0', 'iOS 7'],
        cascade: false
    },
    BUILD: {
        browsers: ['last 2 versions', 'Android >= 4.0', 'iOS 7'],
        cascade: false
    }
};
const BASE64_CONFIG = {                                     // gulp-base64 配置文件
    DEV: {
        extensions: ['svg', 'png', /\.jpg#datauri$/i],
        maxImageSize: 20 * 1024,  // 字节
        debug: true
    },
    BUILD: {
        extensions: ['svg', 'png', /\.jpg#datauri$/i],
        maxImageSize: 20 * 1024,  // 字节
        debug: false
    }
};
const MODIFY_CSS_URLS_CONFIG = {                            // gulp-modify-css-urls 配置
    DEV: {
        modify(url, filePath) {   // 替换 css 样式文件中的 url 地址，这块需要自己配置个性化处理函数
            return `../${PATH_CONFIG.imagesPath}${url}`;
        }
    },
    BUILD: {
        modify(url, filePath) {   // 替换 css 样式文件中的 url 地址，这块需要自己配置个性化处理函数
            return `../${PATH_CONFIG.imagesPath}${url}`;
        }
    }
};

module.exports = { CONTROL_CONFIG, PATH_CONFIG, TASK, ROUTES, AUTO_PREFIXER_CONFIG, BASE64_CONFIG, MODIFY_CSS_URLS_CONFIG };