const path = require('path');
const webpack = require('webpack');


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
	entry: {
		main: './src/js/main.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: '[name].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
        		use: 'babel-loader',
        		include: [resolve('src')]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
	],
	optimization: {
		runtimeChunk: {
			name: 'manifest'
		},
		splitChunks: {
			cacheGroups: {
	            commons: {
	                test: /[\\/]node_modules[\\/]/,
	                name: "vendor",
	                chunks: "all"
	            }
        	}
		}
	}
};