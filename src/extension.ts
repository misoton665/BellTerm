'use strict';

import {BellTerm, CommandCallback} from "./bellterm";
import {window, commands, workspace, InputBoxOptions, ExtensionContext} from 'vscode';

declare function require(x: string): any;

export function activate(context: ExtensionContext) {

  console.log('Congratulations, your extension "bellterm" is now active!');
  
  var consoleChannel = window.createOutputChannel('console');
  consoleChannel.hide();
  
  var bellterm = new BellTerm();
  
  var consoleCreation = commands.registerCommand('extension.createConsole', () => {
    let putStdout: CommandCallback = function(error: Error, stdout: Buffer, stderr: Buffer): void{
          consoleChannel.append("" + stdout);
          consoleChannel.append("" + error);
        },
        command = "ls -l";
    
    //bellterm.runCommand(command, putStdout);
    bellterm.runCommandFile("/Users/misoton/work/workspace/BellTerm/bellterm/run.sh", putStdout);
    
    consoleChannel.show(true);
    consoleChannel.append("Result of \"" + command + "\"\n");
  });
  
  var promptShowing = commands.registerCommand('extension.showPrompt', () => {
    var opt: InputBoxOptions = {};
    opt.prompt = 'Shell Command';
    opt.placeHolder = 'ls -l';
    opt.validateInput = function(args: string) {
      consoleChannel.show(true);
      consoleChannel.append(args);
      window.showInputBox(opt);
      return '';
    };
    window.showInputBox(opt);
  });
  
  var pickShowing = commands.registerCommand('extension.showQuickPick', () => {
    window.showQuickPick(["poe", "pipi"]);
  });
  
  context.subscriptions.push(promptShowing);
  context.subscriptions.push(consoleCreation);
  context.subscriptions.push(consoleChannel);
}

export function deactive() {
}

