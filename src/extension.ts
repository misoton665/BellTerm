'use strict';

import {window, commands, workspace, InputBoxOptions, ExtensionContext} from 'vscode';

declare function require(x: string): any;

var exec = require('child_process').exec;

export function activate(context: ExtensionContext) {

  console.log('Congratulations, your extension "bellterm" is now active!');
  
  var consoleChannel = window.createOutputChannel('console');
  consoleChannel.hide();
  
  var consoleCreation = commands.registerCommand('extension.createConsole', () => {
    exec("ls -l", function(err, stdout, stderr) {
      consoleChannel.append(stdout);
    });
    consoleChannel.show(true);
    consoleChannel.append('HogeHoge');
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
