#!/usr/bin/env node

const commander = require('commander');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const chalk = require('chalk');
const server = require('webpack-dev-server');

const {buildServer, buildCompiler} = require('./main');

const config = require('./webpack.config.js');

const program = new commander.Command('lightup');

program
  .version(require('./package.json').version)
  .option('-r, --run [script]', 'Execute the script')
  .usage('[options] [script.js]')
  .parse(process.argv)

let source_file = program.run;

if (program.run === undefined || typeof program.run !== 'string') {
	console.log(chalk.red('\nA script is required.\n'));
	process.exit(1);
}

let _check = (script) => {
	return fs.existsSync(path.resolve(script))
}

let _eval = (script, env) => {
	const compiler = webpack(config(env, path.resolve(script)));

	buildCompiler(compiler);
	buildServer(compiler);
}

let _run = (script, env) => {
	if (_check(script)) {
		_eval(path.resolve(script), env);
	} else {
		console.log(chalk.red("\nFile not found. Path is invalid. Try again!\n"));
	}
}

_run(source_file, 'development');

