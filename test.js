const { expect } = require('chai');
const path = require('path');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

const config = require('./webpack.config.js');

const compiler = webpack(config('development', path.resolve(__dirname, 'index.js')))

describe('Compiler', () => {
	it ('should compile the app', () => {
		compiler.run((err, stats) => {
			let msg = formatWebpackMessages(stats.toJson());
			let isDone = (!msg.errors[0] && !msg.warnings[0]);
			expect(isDone).to.equal(true);
		});
	});

	it('should not compile the app if the path is invalid', () => {
		const compiler = webpack(config('development', path.resolve(__dirname, '../index.js')))
		compiler.run((err, stats) => {
			let msg = formatWebpackMessages(stats.toJson());
			let isDone = (!msg.errors[0] && !msg.warnings[0]);
			expect(isDone).to.equal(false);
		});	
	});
});
