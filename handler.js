'use babel';
const fs = require('fs');
const path = require('path');
const cache = require('./cache');
const agentType = require('./agent');

function start(res, data) {
	console.log("Now we start!");
	var body = [
		'<html>',
			'<head>',
				'<meta http-equiv=\'Content-Type\' content=\'text/html;\'charset=\'utf-8\'/>',
			'<head>',
			'<body>',
				'<form action=\'/start\' method=\'post\'>',
					'<textarea name=\'text\' rows=\'20\' cols=\'60\'></textarea>',
					'<input type=\'submit\' value=\'提交\'/>',
				'</form>',
				data,
			'</body>',
		'</html>'
	].join("");
	res.writeHead(200, {'Content-Type' : 'text/html'});
	res.write(body);
	res.end();
	fs.writeFile(path.join(__dirname, 'text.txt'), data, function(err) {
		if (err) throw err;
	});
}

function holidays(res, data) {
	console.log("received request for holidays");
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.write(cache.getHolidays());
	res.end();
}

function file(res, pathname, data) {
	console.log("received request for " + path.normalize(pathname).substring(1, 5));
	if (path.normalize(pathname).substring(1, 5) != "file") {
		res.writeHead(404, {'Content-Type' : 'text/plain;charset=utf-8'});
		res.write("火星欢迎您");
		res.end();
	}
	fs.readFile(path.join(__dirname, pathname), function(err, data) {
		if (err) {
			res.writeHead(404, {'Content-Type' : 'text/plain;charset=utf-8'});
			res.write("火星欢迎您 " + pathname);
			res.end();
		} else {
			res.writeHead(200, {'Content-Type' : 'appliction/octet-stream'});
			res.write(data);
			res.end();
		}
	});
}

function agent(res, data, querys) {
	console.log(querys);
	if (typeof querys.type !== 'string' || typeof agentType[querys.type] !== 'function') {
		console.log(typeof querys.type);
		console.log(typeof agentType[querys.type]);
		console.log(agentType);
		res.writeHead(404, {'Content-Type' : 'text/plain;charset=utf-8'});
		res.write("火星欢迎您");
		res.end();
		return;
	}
	console.log(`received request for ${querys.type}`);
	agentType[querys.type](querys, data).then((value) => {
		let retVal = {'data': value};
		let retStr = JSON.stringify(retVal);
		res.writeHead(200, {'Content-Type' : 'text/plain'});
		res.write(retStr);
		res.end();
	}).catch((err) => {
		let retVal = {'error': err};
		let retStr = JSON.stringify(retVal);
		res.writeHead(200, {'Content-Type' : 'text/plain'});
		res.write(retStr);
		res.end();
	});
}

exports.start = start;
exports.holidays = holidays;
exports.file = file;
exports.agent = agent;
