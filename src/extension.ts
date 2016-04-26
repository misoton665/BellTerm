'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, commands, ExtensionContext} from 'vscode';

declare function require(x: string): any;

var exec = require('child_process').exec;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

  console.log('Congratulations, your extension "bellterm" is now active!');
  
  var consoleChannel = window.createOutputChannel('console');
  consoleChannel.hide();
  
  var consoleCreation = commands.registerCommand('extension.createConsole', () => {
    consoleChannel.show(true);
    consoleChannel.appendLine('HogeHoge');
  });
  
  context.subscriptions.push(consoleCreation);
  context.subscriptions.push(consoleChannel);
}

function printStdout(err: string, stdout: string, stderr: string) {
  window.showInformationMessage(stdout.split(' ')[0]);
  window.showInformationMessage('Poe');
}

export function deactive() {
}
