// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Create a status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  statusBarItem.text = "Typewriter: ON";
  statusBarItem.show();

  // Override the default paste command
  let pasteDisposable = vscode.commands.registerTextEditorCommand(
    "typewriter-paste.paste",
    async (editor) => {
      const clipboard = await vscode.env.clipboard.readText();
      if (!clipboard) return;

      // Get current cursor position
      const position = editor.selection.active;

      // Type each character with delay
      let currentPos = position;
      for (const char of clipboard) {
        await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms delay
        await editor.edit((editBuilder) => {
          if (char === "\n") {
            // For line breaks, move to the start of the next line
            currentPos = new vscode.Position(currentPos.line + 1, 0);
            editBuilder.insert(currentPos.translate(1, 0), char);
          } else {
            editBuilder.insert(currentPos, char);
            currentPos = currentPos.translate(0, 1);
          }
        });
      }
    }
  );

  context.subscriptions.push(pasteDisposable, statusBarItem);
}

// This method is called when your extension is deactivated
export function deactivate() {}
