// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { pasteCommand } from "./commands/paste";
import { setDelayCommand } from "./commands/setDelay";

const EXT_NAME = "typewriter";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Create a status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  statusBarItem.text = "Typewriter: ON";
  statusBarItem.show();

  // Add command to set delay
  let setDelayDisposable = vscode.commands.registerCommand(
    `${EXT_NAME}.setDelay`,
    setDelayCommand
  );

  // Override the default paste command
  let pasteDisposable = vscode.commands.registerTextEditorCommand(
    `${EXT_NAME}.paste`,
    pasteCommand
  );

  statusBarItem.text = "Typewriter: OFF";
  statusBarItem.show();

  context.subscriptions.push(
    pasteDisposable,
    setDelayDisposable,
    statusBarItem
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
