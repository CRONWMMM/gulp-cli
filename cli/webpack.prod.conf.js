const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = require('./webpack.config');
// utils
const { resolve } = require('./utils');
const { BUILD } = CONFIG;
const HTML_PLUGINS = (list => list.map(item => new HtmlWebpackPlugin(item)))(BUILD.HTML_PLUGINS);

module.exports = {
	entry: BUILD.ENTRY,
	output: BUILD.OUTPUT,
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': resolve('src')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
        		use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime']
                    }
                },
        		include: [resolve('src')]
			}
		]
	},
    devtool: BUILD.PRODUCTION_SOURCEMAP ? BUILD.DEVTOOL : false,
	plugins: [
        // 使用ProvidePlugin加载的模块在使用时将不再需要import和require进行引入
        new webpack.ProvidePlugin({
            polyfill: 'babel-polyfill'
            // $: 'jquery'
        }),
		// keep module.id stable when vender modules does not change
		// vendor不修改的话会默认使用浏览器之前缓存的vendor，webpack不会重新打包生成hash文件
    	new webpack.HashedModuleIdsPlugin(),
    	...HTML_PLUGINS
	],
	optimization: {		// webpack4+相对于3+的版本修改
		runtimeChunk: {
			name: 'manifest'
		},
		splitChunks: {
			cacheGroups: {
	            commons: {
	                test: /[\\/]node_modules[\\/]/,
	                name: "vendor",
	                chunks: "all",
					minChunks: 2	// 公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。
	            }
        	}
		}
	},
    mode: 'production',
};