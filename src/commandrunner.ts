declare function require(x: string): any;
var exec = require('child_process').exec;

export class CommandRunner {
  constructor() {}
  
  run<T>(command: string): (callback: (error: Error, stdout: Buffer, stderr: Buffer) => T) => T {
    return function(callback: (error: Error, stdout: Buffer, stderr: Buffer) => T) {
      var result: T;
      exec(command, function(error: Error, stdout: Buffer, stderr: Buffer){
        result = callback(error, stdout, stderr);
      });
      return result;
    }
  }
}
