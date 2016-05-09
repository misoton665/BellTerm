'use strict';

import {BellTerm, CommandCallback} from "./bellterm";
import {window, commands, workspace, InputBoxOptions, ExtensionContext} from 'vscode';

declare function require(x: string): any;

export function activate(context: ExtensionContext) {

  console.log('Congratulations, your extension "bellterm" is now active!');
  
  var consoleChannel = window.createOutputChannel('console');
  consoleChannel.hide();
  
  var bellterm = new BellTerm(workspace.rootPath + "/");
  
  var consoleCreation = commands.registerCommand('extension.createConsole', () => {
    let putStdout: CommandCallback = function(error: Error, stdout: Buffer, stderr: Buffer): void{
          consoleChannel.append("" + stdout);
          if(error !== null) {
            consoleChannel.append("" + error);
          }
        };
    
    consoleChannel.show(true);
    
    console.log(bellterm.getDefaultCommandFile());
    
    bellterm.runCommandFile("./run.sh", putStdout);
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

