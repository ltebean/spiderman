#!/usr/bin/env node

var program = require('commander');
var Spiderman = require('../lib/spiderman');

program.version('0.0.1')

program
	.command('start')
	.description('run crawler')
	.option("-p, --path [path]", "config file path")
	.option("-l, --log [log]", "log level {debug|info|warn|error}, defaults to debug")
	.action(function(options) {
		if (!options.path) {
			console.log('you must specified the config file');
			return;
		}
		new Spiderman({
			configFile: options.path,
			logLevel: options.log
		}).start();
	});

program
	.command('run')
	.description('run a single component')
	.option("-p, --path [path]", "config file path")
	.option("-n, --name [name]", "component name")
	.option("-d, --data [data]", "initial data")
	.option("-l, --log [log]", "log level {debug|info|warn|error}, defaults to debug")
	.action(function(options) {
		if (!options.path) {
			console.log('you must specified the config file');
			return;
		}
		new Spiderman({
			configFile: options.path,
			logLevel: options.log
		}).run(options.name, options.data);
	});

program.parse(process.argv);
if (program.args.length === 0) program.help()