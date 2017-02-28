'use babel';

const Path = require('path');
const fs = require('fs');
const os = require('os');
const process = require('process');
const cmd = require('./communication').cmd;

let promiseList = (path) => {
  path = Path.normalize(path);
  console.log(`cwd:${process.cwd()}`);
  path = Path.isAbsolute(path) ? path : Path.join(process.cwd(), path);
  return new Promise(function(resolve, reject) {
    fs.readdir(path, (err, files) => {
      if (err) {
        console.log(err.toString());
        reject(err);
      }
      files.forEach((value, index, arr) => {
        arr[index] = Path.join(path, value);
      });
      let filesWithDir = [];
      filesWithDir.push(path.concat(Path.sep + '..'));
      filesWithDir = filesWithDir.concat(files);
      resolve(filesWithDir);
    });
  });
};
let promiseStat = (path) => {
  return new Promise(function(resolve, reject) {
    fs.lstat(path, (err, stats) => {
      if (err) {
        console.log(err.toString());
        reject(err);
      }
      resolve({'file': path, 'stats': stats});
    });
  });
};
let promiseWrite = (data, options) => {
  return new Promise(function(resolve, reject) {
    let path = Path.join(options.dir, options.file);
    console.log(JSON.stringify(options));
    console.log(`path:${path}`);
    let writer = fs.createWriteStream(path, options);
    writer.on('finish', () => {
      resolve(true);
    });
    writer.on('error', (err) => {
      reject(err);
    });
    writer.end(data);
  });
};

module.exports = {
  list: (argObj) => {
    let command = 'ls';
    let args = [];
    args.push();
    let cwd = argObj.path;
    return cmd(command, args, cwd);
  },
  stat: (argObj) => {
    return promiseList(argObj.path).then((files) => {
      return files.map((cur, index, arr) => {
        return promiseStat(cur);
      });
    }).then((values) => {
      return Promise.all(values);
    });
  },
  receiveFile: (argObj, data) => {
    return promiseWrite(data, argObj);
  },
  make: (argObj) => {
    let command = 'make';
    let args = [];
    args.push(argObj.target);
    let cwd = argObj.path;
    return cmd(command, args, cwd);
  }
}
