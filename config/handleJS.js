module.exports = () => {
	return {
		module: {
			rules: [
				{
					test: /\.js$/,
					loaders: [
						"babel-loader?cacheDirectory,presets[]=es2015,presets[]=stage-0,presets[]=react,plugins[]=transform-runtime"
					],
					exclude: /node_modules/
				}
			]
		}
	}
}