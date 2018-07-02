module.exports = {
    serverPath: 'server/',                                  // 服务路径
    libPath: '',                                            // 依赖库路径
    srcPath: 'src/',                                        // 源码路径
    devPath: 'build/',                                      // 开发环境
    prodPath: 'dist/',                                      // 生产环境
    staticPath: 'static/',                                  // 静态资源路径
    imagesPath: 'static/',                                  // 图片路径
    fontsPath: 'static/',                                   // 字体文件路径
    templatePath: {
        root: 'views/'
    },
    stylePath: {
        root: 'style/',
        css: {
            entry: 'style/**/*.css'
        },
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
        dev: 'build/runtime-dev/',
        build: 'runtime-build/'
    },
    revPath: {                                              // 随机文件名后生成的映射JSON地址，代表根路径开始的绝对路径（不使用随机文件名的情况下改配置不生效）
        root: 'rev/',                                       // 根目录
        fileName: {                                         // 生成的rev映射文件名
            css: 'css-manifest.json'
        }
    }
};