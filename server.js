'use babel';
const http = require('http');
const url = require('url');
const querystring = require('querystring');

function start(route, handle) {
	function onRequest(req, res) {
		let pathname = url.parse(req.url).pathname;
		let postData = "";
		let querys = querystring.parse(url.parse(req.url).query);
		console.log(new Date() + "\nFrom:\t" + getClientIP(req) + "\nRequest for " + pathname + " received.");
		//req.setEncoding("utf-8");
		req.addListener("data", function (postDataChunk) {
			postData += postDataChunk;
		});
		req.addListener("end", function () {
			route(handle, pathname, res, postData, querys);
			console.log("listener end end");
		});
		console.log("onRequest end");
	}
	http.createServer(onRequest).listen(8080);
	console.log("server started.");
}

function getClientIP(req) {
	return req.headers['x-forward-for'] ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress;
}

exports.start = start;
