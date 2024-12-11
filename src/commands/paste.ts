import { TextEditor, workspace, Position, env } from "vscode";
import { DELAY_DEFAULT_VALUE, DELAY_PROPS_NAME, EXT_NAME } from "../constants";

export const pasteCommand = async (editor: TextEditor) => {
  const clipboardText = await env.clipboard.readText();
  if (!clipboardText) return;

  // Get delay from configuration
  const delay = workspace
    .getConfiguration(EXT_NAME)
    .get(DELAY_PROPS_NAME, DELAY_DEFAULT_VALUE);

  const initialPosition = editor.selection.active;

  let currentPos = initialPosition;
  for (const char of clipboardText) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    await editor.edit((editBuilder) => {
      if (char === "\n") {
        currentPos = new Position(currentPos.line + 1, 0);
        editBuilder.insert(currentPos.translate(1, 0), char);
      } else {
        editBuilder.insert(currentPos, char);
        currentPos = currentPos.translate(0, 1);
      }
    });
  }
};
