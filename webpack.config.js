const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const handleJS = require('./config/handleJS');
const handleStyling = require('./config/handleStyling');
const handleSourceMaps = require('./config/handleSourceMaps');

const pkg_path = path.resolve(__dirname, 'package.json'); 

const pkgs = require(pkg_path).dependencies;

const initialConfig = merge([
	{
		entry: [
			"webpack-dev-server/client?http://localhost:8000",
			"webpack/hot/dev-server",
		],
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'build')
		},
		resolve: {
			extensions: ['.js', '.jsx', '.css'],
      modules: [path.resolve(__dirname, 'node_modules')]
		},
		target: 'web',
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, './index.html'),
				mobile: true,
				inject: 'body'
			})
		]
	},
	handleJS(),
	handleStyling(),
	handleSourceMaps({ type: 'cheap-module-eval-source-map' })
]);

// Experimental
const optimiseConfig = merge([
  {
  	entry: {},
  	output: {
  		filename: '[chunkhash].[name].js',
  		path: path.resolve(__dirname, 'build'),
  		publicPath: '/'
  	},
  	target: 'web',
  	module: {
    	rules: [
      	{
        	test: /\.css$/,
        	exclude: /node_modules/,
        	use: ExtractTextPlugin.extract({
            use: 'css-loader?sourceMap'
        	})
      	}
    	]
  	},
  },
  handleJS(),
  handleSourceMaps({ type: 'source-map' })
])

// Experimental
const productionConfig = merge([
	{
		plugins: [
		  new HtmlWebpackPlugin({
      	template: path.resolve(__dirname, 'index.html')
    	}),
    	new webpack.optimize.UglifyJsPlugin({
    		sourceMap: true,
    		beautify: false,
    		comments: false,
    		compress: {
    			warnings: false
    		},
    		mangle: {
    			except: ['$'],
    			screw_i8: true,
    			keep_fnames: true
    		}
    	}),
    	new ExtractTextPlugin(
    		{ 
    			filename: 'bundle.css', 
    			allChunks: true,
    			disable: false 
    		}
    	),           
    	new webpack.DefinePlugin({
      	'process.env.NODE_ENV': JSON.stringify('production')
    	}),
    	new webpack.optimize.CommonsChunkPlugin({
      	name: ['vendor', 'manifest']
    	}),
    	// new CleanWebpackPlugin(['build'], {
     //  	root: path.resolve(__dirname, 'build')
    	// })
		]
	}
]);

const developmentConfig = merge([
	{
		plugins: [
			new webpack.NamedModulesPlugin(),
			new webpack.HotModuleReplacementPlugin(),
		]
	}
])

module.exports = (env, src_file) => {
  // Experimental
	if (env === 'production') {
		
		let addPoints = optimiseConfig.entry;

		addPoints.vendor = Object.keys(pkgs);
		addPoints.main = path.resolve(src_file);
		
		return merge(optimiseConfig, productionConfig);
	} 
	else {
		
		initialConfig["entry"].unshift(path.resolve(src_file));

		return merge(initialConfig, developmentConfig);
	}
}
