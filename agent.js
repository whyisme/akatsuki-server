'use babel';

const Commands = require('./commands');
const agent = {};
agent['list'] = Commands.list;
agent['stat'] = Commands.stat;
agent['receiveFile'] = Commands.receiveFile;
agent['make'] = Commands.make;

module.exports = agent;
