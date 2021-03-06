/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var cp = require('child_process');

var argv = process.argv;
argv.shift();
argv.shift();
var extraArgs = argv;

function bindOutput(p) {
	p.stdout.on("data", function(data) {
		process.stdout.write(data);
	});
	p.stderr.on("data", function(data) {
		process.stderr.write(data);
	});
}
function join(a, b) {
	a = a.slice(0);
	Array.prototype.push.apply(a, b);
	return a;
}

try {
	require("vm-browserify");
	compile();
} catch(e) {
	console.log("install vm-browserify...");
	cp.exec("npm install vm-browserify", function (error, stdout, stderr) {
		console.log(stdout);
		compile();
	});
}
function compile() {
	console.log("compile scripts...");

	var extraArgsNoWatch = extraArgs.slice(0);
	var watchIndex = extraArgsNoWatch.indexOf("--watch");
	if(watchIndex != -1) extraArgsNoWatch.splice(watchIndex, 1);
	var libary1 = cp.spawn("node", join(["../../bin/webpack.js", "--colors", "--single", "--libary", "libary1",
											"node_modules/libary1", "js/libary1.js"], extraArgsNoWatch));
	bindOutput(libary1);
	libary1.on("exit", function(code) {
		if(code === 0) {
			var main = cp.spawn("node", join(["../../bin/webpack.js", "--colors", "--alias", "vm=vm-browserify",
												"--script-src-prefix", "js/", "lib/index", "js/web.js"], extraArgs));
			bindOutput(main);
		}
	});
	var libary2 = cp.spawn("node", join(["../../bin/webpack.js", "--colors", "--libary", "libary2",
										"--script-src-prefix", "js/", "node_modules/libary2", "js/libary2.js"], extraArgs));
	bindOutput(libary2);
}
