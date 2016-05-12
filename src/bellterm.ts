import {window, OutputChannel} from 'vscode';

declare function require(x: string): any;

// for command running
var cp = require('child_process');
  
// for shell command file access and chmod
var fs = require('fs');

var outputChannel: OutputChannel = window.createOutputChannel('console');

export type CommandCallback = (error: Error, stdout: Buffer, stderr: Buffer) => void;
export type CommandResultTuple = [Error, Buffer, Buffer];

export class BellTerm {
  
  // root path of working directory
  private dirroot: string;
  
  // outputChannel on vsc api
  private outputChannel: OutputChannel;
  
  constructor(dirroot: string = "/") {
    this.dirroot = dirroot;
    this.outputChannel = window.createOutputChannel('console');
  }
  
  private accessFileAsync(filePath: string, mode: any): Promise<{}> {
    return new Promise((resolve: (option: {}) => void, reject: (error: Error) => void) => {
      fs.access(filePath, mode, function(err: Error){
        console.log(err ? 'no access!' : 'can read/write');
        if(err) {
          reject(err);
        } else {
          resolve({});
        }
      });
    });
  }
  
  private runCommandAsync(command: string, option: {}): Promise<CommandResultTuple> {
    return new Promise(function(resolve: (tuple: CommandResultTuple) => void, reject: (error: Error) => void) {
      cp.exec(command, option, function(error: Error, stdout: Buffer, stderr: Buffer) {
        if(error) {
          reject(error);
        } else {
          resolve([error, stdout, stderr]);
        }
      });
    });
  }
  
  private runCommandFileAsync(filePath: string, args: string[], option: {}) {
    return new Promise((resolve: (tuple: CommandResultTuple) => void, reject: (error: Error) => void) => {
      cp.execFile(filePath, args, option, function(error: Error, stdout: Buffer, stderr: Buffer) {
        console.log(error ? 'error!' : 'can exetuce');
        if(error) {
          reject(error);
        } else {
          resolve([error, stdout, stderr]);
        }
      });
    });
  }
  
  private onFailureFileAccessing(err: Error): void {
    outputChannel.show(true);
    outputChannel.append("Error has occured by file access.");
  }
  
  private onFailureCommandRunning(err: Error): void {
    this.outputChannel.show(true);
    this.outputChannel.append("Error has occured by command running.");
  }
  
  private onFailureCommandFileRunning(error: Error): void {
    console.log("oga");
    this.outputChannel.show(true);
    this.outputChannel.append("Error has occured by command file running.");
  }
  
  public getDefaultCommandFile(): string {
    return this.dirroot + "run.sh";
  }
  
  public runCommand(command: string, callback: CommandCallback, option: {} = {cwd: this.dirroot}){
    this.runCommandAsync(command, option).then((result: CommandResultTuple): void => {
      let [error, stdout, stderr]: CommandResultTuple = result;
      callback(error, stdout, stderr);
    }, this.onFailureCommandRunning);
  }
  
  public runCommandFile(file: string, callback: CommandCallback, option: {} = {cwd: this.dirroot}){
    if (!file) {
      file = this.getDefaultCommandFile();
    }
    this.accessFileAsync(file, fs.X_OK).then((option: {}): void => {}, this.onFailureFileAccessing)
      .then(() => {
        this.runCommandFileAsync(this.getDefaultCommandFile(), [], {}).then(function(result: CommandResultTuple) {
          let [error, stdout, stderr]: CommandResultTuple = result;
          callback(error, stdout, stderr);
        });
      });
  }
}
