const vscode = require("vscode");

const SETTING = "files.exclude";
const STATUS_COMMAND = "fileHideToggle.toggle";

function activate(context) {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  statusBar.text = "$(eye-closed) Toggle Hidden Files";
  statusBar.tooltip = "Choose files to hide or unhide in the Explorer";
  statusBar.command = STATUS_COMMAND;
  statusBar.show();
  context.subscriptions.push(statusBar);

  context.subscriptions.push(
    vscode.commands.registerCommand(STATUS_COMMAND, async () => {
      const folders = vscode.workspace.workspaceFolders;

      if (!folders?.length) {
        vscode.window.showInformationMessage("Open a workspace folder first.");
        return;
      }

      // Use VS Code's file picker to select files from the workspace.
      const selected = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: true,
        openLabel: "Select files"
      });

      if (!selected?.length) return;

      const config = vscode.workspace.getConfiguration("files");
      const excludes = { ...config.get("exclude", {}) };

      // Toggle each chosen file: hidden files are unhidden; visible files are hidden.
      for (const uri of selected) {
        const relativePath = vscode.workspace.asRelativePath(uri, false);
        const pattern = `**/${escapeGlob(relativePath)}`;

        if (excludes[pattern]) {
          delete excludes[pattern];
        } else {
          excludes[pattern] = true;
        }
      }

      await config.update(
        "exclude",
        excludes,
        vscode.ConfigurationTarget.Workspace
      );

      vscode.window.showInformationMessage(
        "Updated hidden files. The Explorer may take a moment to refresh."
      );
    })
  );
}

function escapeGlob(path) {
  // Escape glob metacharacters so filenames are treated literally.
  return path.replace(/[\\*?[\]{}]/g, "\\$&");
}

function deactivate() {}

module.exports = { activate, deactivate };
