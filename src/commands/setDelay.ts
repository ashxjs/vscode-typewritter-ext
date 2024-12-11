import * as vscode from "vscode";
import { EXT_NAME } from "../constants";

export const setDelayCommand = async () => {
  const result = await vscode.window.showInputBox({
    prompt: "Enter delay in milliseconds (minimum 1ms)",
    value: String(vscode.workspace.getConfiguration(EXT_NAME).get("delay", 50)),
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
};
