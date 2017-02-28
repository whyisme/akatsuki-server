'use babel';

const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');

let cmd = (command, args, cwd, successRetVal = [0]) => {
  return new Promise((resolve, reject) => {
    const spawn = require('child_process').spawn;
    console.log(`command:${command}\nargs:${args}`);
    let proc = spawn(command, args, {cwd: cwd});
    let outInfo = [];
    let errInfo = [];
    proc.stdout
      .pipe(iconv.decodeStream('gbk'))
      .on('data', (data) => {
        console.log(`stdout: ${data}`);
        outInfo.push(data);
      });
    proc.stderr
      .pipe(iconv.decodeStream('gbk'))
      .on('data', (data) => {
        console.log(`stderr: ${data}`);
        errInfo.push(data);
      });
    proc.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if (!successRetVal.includes(code)) {
        let arrEInfo = errInfo.join('\n');
        reject(new Error({'code': code, 'message': arrEInfo}));
      } else {
        resolve(outInfo);
      }
    });
    proc.on('error', (err) => {
      console.log(err.toString());
      reject(err);
    });
  });
};

module.exports.cmd = cmd;
