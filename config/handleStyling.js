module.exports = () => {
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
					exclude: /node_modules/
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader'],
					exclude: /node_modules/					
				}
			]
		}
	}
}