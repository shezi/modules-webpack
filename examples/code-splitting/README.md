# example.js

``` javascript
var a = require("a");
var b = require("b");
require.ensure(["c"], function(require) {
    require("b").xyz();
    var d = require("d");
});
```


# js/output.js

``` javascript
/******/(function(document, undefined) {
/******/	return function(modules) {
/******/		var installedModules = {}, installedChunks = {0:1};
/******/		function require(moduleId) {
/******/			if(typeof moduleId !== "number") throw new Error("Cannot find module '"+moduleId+"'");
/******/			if(installedModules[moduleId])
/******/				return installedModules[moduleId].exports;
/******/			var module = installedModules[moduleId] = {
/******/				exports: {}
/******/			};
/******/			modules[moduleId](module, module.exports, require);
/******/			return module.exports;
/******/		}
/******/		require.ensure = function(chunkId, callback) {
/******/			if(installedChunks[chunkId] === 1) return callback(require);
/******/			if(installedChunks[chunkId] !== undefined)
/******/				installedChunks[chunkId].push(callback);
/******/			else {
/******/				installedChunks[chunkId] = [callback];
/******/				var head = document.getElementsByTagName('head')[0];
/******/				var script = document.createElement('script');
/******/				script.type = 'text/javascript';
/******/				script.charset = 'utf-8';
/******/				script.src = modules.c+chunkId+modules.a;
/******/				head.appendChild(script);
/******/			}
/******/		};
/******/		window[modules.b] = function(chunkId, moreModules) {
/******/			for(var moduleId in moreModules)
/******/				modules[moduleId] = moreModules[moduleId];
/******/			var callbacks = installedChunks[chunkId];
/******/			installedChunks[chunkId] = 1;
/******/			for(var i = 0; i < callbacks.length; i++)
/******/				callbacks[i](require);
/******/		};
/******/		return require(0);
/******/	}
/******/})(document)
/******/({a:".output.js",b:"webpackJsonp",c:"",
/******/0: function(module, exports, require) {

var a = require(/* a */2);
var b = require(/* b */1);
require.ensure(1, function(require) {
    require(/* b */1).xyz();
    var d = require(/* d */4);
});

/******/},
/******/
/******/1: function(module, exports, require) {

// module b

/******/},
/******/
/******/2: function(module, exports, require) {

// module a

/******/},
/******/
/******/})
```

# js/1.output.js

``` javascript
/******/webpackJsonp(1, {
/******/3: function(module, exports, require) {

// module c

/******/},
/******/
/******/4: function(module, exports, require) {

// module d

/******/},
/******/
/******/})
```

Minimized

``` javascript
webpackJsonp(1,{3:function(a,b,c){},4:function(a,b,c){}})
```

# Info

## Uncompressed

```
Hash: efedb0352f230f80a7d673655c226d6b
Chunks: 2
Modules: 5
Modules including duplicates: 5
Modules pre chunk: 2.5
Modules first chunk: 3
     output.js:     2071 characters
   1.output.js:      200 characters

 <id>    <size>  <filename>
       <reason> from <filename>
output.js
    0       155  .\example.js
       main
    1        11  .\~\b.js
       require (2x) from .\example.js
    2        11  .\~\a.js
       require (1x) from .\example.js
1.output.js
    3        11  .\~\c.js
       async require (1x) from .\example.js
    4        11  .\~\d.js
       async require (1x) from .\example.js
```

## Minimized (uglify-js, no zip)

```
Hash: efedb0352f230f80a7d673655c226d6b
Chunks: 2
Modules: 5
Modules including duplicates: 5
Modules pre chunk: 2.5
Modules first chunk: 3
     output.js:      747 characters
   1.output.js:       57 characters

 <id>    <size>  <filename>
       <reason> from <filename>
output.js
    0        82  .\example.js
       main
    1         0  .\~\b.js
       require (2x) from .\example.js
    2         0  .\~\a.js
       require (1x) from .\example.js
1.output.js
    3         0  .\~\c.js
       async require (1x) from .\example.js
    4         0  .\~\d.js
       async require (1x) from .\example.js
```
