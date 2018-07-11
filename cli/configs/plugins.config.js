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

module.exports = { AUTO_PREFIXER_CONFIG, BASE64_CONFIG };