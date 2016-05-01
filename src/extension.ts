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
    exec("ls -l", function(err, stdout, stderr) {
      consoleChannel.append(stdout);
    });
    consoleChannel.show(true);
    consoleChannel.append('HogeHoge');
  });
  
  context.subscriptions.push(consoleCreation);
  context.subscriptions.push(consoleChannel);
}

var showStdout = compose3(extractStdout, window.showInformationMessage);

function extractStdout(err: string, stdout: string, stderr: string) {
  return stdout;
}

function compose1<A, B, C>(f: (A) => B, g: (B) => C) {
  return function(arg: A) {
    return g(f(arg));
  }
}

function compose3<A1, A2, A3, B, C>(f: (A1, A2, A3) => B, g: (B) => C) {
  return function(arg1: A1, arg2: A2, arg3: A3) {
    return g(f(arg1, arg2, arg3));
  }
}

export function deactive() {
}
