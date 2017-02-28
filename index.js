'use babel';
const server = require("./server");
const router = require("./router");
const handler = require("./handler");
const cache = require("./cache");

let handle = {};
handle["/"] = handler.start;
handle["/start"] = handler.start;
handle["/holidays"] = handler.holidays;
handle["/file"] = handler.file;
handle["/agent"] = handler.agent;
handle["/upload"] = handler.upload;

cache.getHolidays();

server.start(router.route, handle);
