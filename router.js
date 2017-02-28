function route(handle, pathname, res, postData, querys) {
	console.log("route :" + pathname);
	if (typeof handle[pathname] === 'function') {
		handle[pathname](res, postData, querys);
	} else if (pathname.indexOf("/", 1) > 0 && typeof handle[pathname.substring(0, pathname.indexOf("/", 1))] === 'function') {
		handle[pathname.substring(0, pathname.indexOf("/", 1))](res, pathname, postData, querys);
	} else {
		console.log("No way!");
		res.writeHead(404, {'Content-Type' : 'text/plain;charset=utf-8'});
		res.write("火星欢迎您");
		res.end();
	}
	console.log("route end");
}

exports.route = route;
