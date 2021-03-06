#!/usr/bin/env node

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");
var fs = require("fs");
var util = require("util");
var sprintf = require("sprintf").sprintf;
var argv = require("optimist")
	.usage("Usage: $0 <input> <output>")

	.boolean("single")
	.describe("single", "Disable Code Splitting")
	.default("single", false)

	.boolean("min")
	.describe("min", "Minimize it with uglifyjs")
	.default("min", false)

	.boolean("filenames")
	.describe("filenames", "Output Filenames Into File")
	.default("filenames", false)

	.string("options")
	.describe("options", "Options JSON File")

	.string("script-src-prefix")
	.describe("script-src-prefix", "Path Prefix For JavaScript Loading")

	.string("libary")
	.describe("libary", "Stores the exports into this variable")

	.boolean("colors")
	.describe("colors", "Output Stats with colors")
	.default("colors", false)

	.boolean("json")
	.describe("json", "Output Stats as JSON")
	.default("json", false)

	.boolean("by-size")
	.describe("by-size", "Sort modules by size in Stats")
	.default("by-size", false)

	.boolean("verbose")
	.describe("verbose", "Output dependencies in Stats")
	.default("verbose", false)

	.string("alias")
	.describe("alias", "Set a alias name for a module. ex. http=http-browserify")

	.boolean("debug")
	.describe("debug", "Prints debug info to output files")
	.default("debug", false)

	.boolean("watch")
	.describe("watch", "Recompiles on changes (except loaders)")
	.default("watch", false)

	.boolean("progress")
	.describe("progress", "Displays a progress while compiling")
	.default("progress", false)

	.demand(1)
	.argv;

var input = argv._[0],
	output = argv._[1];

if (input && input[0] !== '/' && input[1] !== ':') {
	input = path.join(process.cwd(), input);
}
if (output && output[0] !== '/' && input[1] !== ':') {
	output = path.join(process.cwd(), output);
}

var options = {};

if(argv.options) {
	options = JSON.parse(fs.readFileSync(argv.options, "utf-8"));
}

if(argv["script-src-prefix"]) {
	options.scriptSrcPrefix = argv["script-src-prefix"];
}

if(argv.min) {
	options.minimize = true;
}

if(argv.debug) {
	options.debug = true;
}

if(argv.watch) {
	options.watch = true;
}

if(argv.filenames) {
	options.includeFilenames = true;
}

if(argv.libary) {
	options.libary = argv.libary;
}

if(argv.alias) {
	if(typeof argv.alias === "string")
		argv.alias = [argv.alias];
	options.resolve = options.resolve || {};
	options.resolve.alias = options.resolve.alias || {};
	var aliasObj = options.resolve.alias;
	argv.alias.forEach(function(alias) {
		alias = alias.split("=");
		aliasObj[alias[0]] = alias[1];
	});
}

var webpack = require("../lib/webpack.js");
var formatOutput = require("../lib/formatOutput.js");

function c(str) {
	return argv.colors ? str : "";
}

if(!output) {
	webpack(input, options, function(err, source) {
		if(err) {
			console.error(err);
			return;
		}
		if(output) {
			fs.writeFileSync(output, source, "utf-8");
		} else {
			process.stdout.write(source);
		}
	});
} else {
	output = output || path.join(process.cwd(), "js", "web.js");
	if(!options.outputDirectory) options.outputDirectory = path.dirname(output);
	if(!options.output) options.output = path.basename(output);
	if(!options.outputPostfix) options.outputPostfix = "." + path.basename(output);
	if(argv.progress) {
		if(!options.events) options.events = new (require("events").EventEmitter)();
		var events = options.events;
		
		var sum = 0;
		var finished = 0;
		var chars = 0;
		function print() {
			var msg = "";
			if(sum > 0) {
				msg += "compiling... (" + c("\033[1m\033[33m");
				msg += sprintf("%4s", finished+"") + "/" + sprintf("%4s", sum+"");
				msg += " " + sprintf("%4s", Math.floor(finished*100/sum)+"%");
				msg += c("\033[39m\033[22m") + ")";
			}
			for(var i = 0; i < chars; i++)
				process.stderr.write("\b");
			process.stderr.write(msg);
			chars = msg.length;
		}
		events.on("task", function(name) {
			sum++;
			print();
		});
		events.on("task-end", function(name) {
			finished++;
			if(name) {
				for(var i = 0; i < chars; i++)
					process.stderr.write("\b \b");
				process.stderr.write(name + " " + c("\033[1m\033[32m") + "done" + c("\033[39m\033[22m") + "\n");
				chars = 0;
			}
			print();
		});
		events.on("bundle", function(name) {
			sum = 0;
			finished = 0;
			for(var i = 0; i < chars; i++)
				process.stderr.write("\b \b");
			chars = 0;
		});
	}
	webpack(input, options, function(err, stats) {
		if(err) {
			console.error(err);
			return;
		}
		if(argv.json)
			console.log(util.inspect(stats, false, 10, argv.colors));
		else {
			console.log(formatOutput(stats, {
				colors: argv.colors,
				"by-size": argv["by-size"],
				verbose: argv.verbose
			}));
		}
	});
}