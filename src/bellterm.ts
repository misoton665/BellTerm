declare function require(x: string): any;

export type CommandCallback = (error: Error, stdout: Buffer, stderr: Buffer) => void;
export type CommandResultTuple = [Error, Buffer, Buffer];

export class BellTerm {
  // for command running
  private cp = require('child_process');
  
  // for shell command file access and chmod
  private fs = require('fs');
  private dirroot: string;
  
  constructor(dirroot: string = "/") {
    this.dirroot = dirroot;
  }
  
  private accessFileAsync(filePath: string, mode: any): Promise<boolean> {
    return new Promise(function(resolve, reject) {
      this.fs.access(filePath, mode, function(err){
        if(err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  }
  
  private runCommandAsync(command: string, option: {}): Promise<CommandResultTuple> {
    return new Promise(function(resolve, reject) {
      this.cp.exec(command, option, function(error, stdout, stderr) {
        if(error) {
          reject(error);
        } else {
          resolve([error, stdout, stderr]);
        }
      });
    });
  }
  
  public getDefaultCommandFile(): string {
    return this.dirroot + "run.sh";
  }
  
  public runCommand(command: string, callback: CommandCallback, option: {} = {cwd: this.dirroot}){
    this.cp.exec(command, option, callback);
  }
  
  public runCommandFile(file: string, callback: CommandCallback, option: {} = {cwd: this.dirroot}){
    this.cp.execFile(file, [], option, callback);
  }
}
