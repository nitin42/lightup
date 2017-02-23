module.exports = ({ use }) => {
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					exclude: /node_modules/,
					use: ExtractTextPlugin.extract({
						use: use,
						fallback: 'style-loader'
					})
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('[name].css')
		]
	}
}
