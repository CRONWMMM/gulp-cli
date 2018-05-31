const CONTROL_CONFIG = {
    need_dev: true,                                     // 是否需要使用dev环境/是否需要打包一份build文件夹
    random_file_name: true,                             // 是否需要随机文件名
    source_maps: {                                      // 是否需要生成map映射文件
        js_map: true,
        style_map: true
    }
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
        modify(url, filePath) {                             // 替换 css 样式文件中的 url 地址，这块需要自己配置个性化处理函数
            return `../${PATH_CONFIG.staticPath}${url}`;
        }
    },
    BUILD: {
        modify(url, filePath) {   // 替换 css 样式文件中的 url 地址，这块需要自己配置个性化处理函数
            return `../${PATH_CONFIG.imagesPath}${url}`;
        }
    }
};

module.exports = { CONTROL_CONFIG, AUTO_PREFIXER_CONFIG, BASE64_CONFIG, MODIFY_CSS_URLS_CONFIG };