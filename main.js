const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const openBrowser = require('react-dev-utils/openBrowser');

const config = require('./webpack.config.js');

global.tty_mode = process.stdout.isTTY; // Represent the terminal state (referenced from react-scripts)

let buildCompiler = (compiler) => {
	compiler.plugin('invalid', () => {
		if (tty_mode) {
			clearConsole(); // Clears the terminal (state)
		}

		console.log("Compiling...");
	})

	let first_compilation = true;

	compiler.plugin('done', (stats) => {
		if (tty_mode) {
  		clearConsole(); 
		}

		let msg = formatWebpackMessages(stats.toJson({}, true));
		let isDone = (!msg.errors[0] && !msg.warnings[0]);
		let helper = isDone && (tty_mode || first_compilation); // Show instructions

		if (isDone) {
  		console.log("Compiled successfully!");
		}

		if (helper) {
  		console.log();
  		console.log('The app is running at:');
  		console.log();
  		console.log('  ' + chalk.cyan('http://localhost:8000'));
  		console.log();
  		first_compilation = false;
		}

		if (msg.errors.length) {
  		console.log(chalk.red('Failed to compile.'));
  		console.log();
  		console.log(msg.errors[0]);
		}	

		if (msg.warnings.length) {
  		console.log(chalk.yellow('Compiled with warnings.'));
  		console.log();
  		msg.warnings.forEach(message => {
    		console.log(message);
    		console.log();
  		});
  		console.log('You may use special comments to disable some warnings.');
  		console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
  		console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
		}
	});
}

let buildServer = (compiler) => {
	new WebpackDevServer(compiler, {
		watchOptions: {
    	ignored: /node_modules/
  	},
  	historyApiFallback: true,
  	publicPath: '/',
  	quiet: true,
  	clientLogLevel: "error"
	}).listen(8000, (err, res) => {
		if (err) { console.log(err); }

		if (tty_mode) {
  		clearConsole();
		}

		console.log(chalk.cyan('Starting server...'));
		console.log();
		openBrowser('http://localhost:8000');
	});
}

module.exports = {
	buildCompiler,
	buildServer,
}
