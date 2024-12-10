// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

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
    async () => {
      const result = await vscode.window.showInputBox({
        prompt: "Enter delay in milliseconds (minimum 1ms)",
        value: String(
          vscode.workspace.getConfiguration(EXT_NAME).get("delay", 50)
        ),
        validateInput: (value) => {
          const num = parseInt(value);
          return !isNaN(num) && num >= 1
            ? null
            : "Please enter a valid number >= 1";
        },
      });

      if (result) {
        await vscode.workspace
          .getConfiguration(EXT_NAME)
          .update("delay", parseInt(result), vscode.ConfigurationTarget.Global);
      }
    }
  );

  // Override the default paste command
  let pasteDisposable = vscode.commands.registerTextEditorCommand(
    `${EXT_NAME}.paste`,
    async (editor) => {
      const clipboard = await vscode.env.clipboard.readText();
      if (!clipboard) return;

      // Get delay from configuration
      const delay = vscode.workspace
        .getConfiguration(EXT_NAME)
        .get("delay", 50);
      const position = editor.selection.active;

      let currentPos = position;
      for (const char of clipboard) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        await editor.edit((editBuilder) => {
          if (char === "\n") {
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

  context.subscriptions.push(
    pasteDisposable,
    setDelayDisposable,
    statusBarItem
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
