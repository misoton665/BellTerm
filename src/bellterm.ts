declare function require(x: string): any;

export type CommandCallback = (error: Error, stdout: Buffer, stderr: Buffer) => void;

export class BellTerm {
  private cp = require('child_process');
  private dirroot: string;
  
  constructor(dirroot: string = "/") {
    this.dirroot = dirroot;
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
