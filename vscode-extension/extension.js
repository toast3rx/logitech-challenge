// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const logi = import('logi-plugin-sdk');
console.log(logi);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

const install = async () => {
  const isWin = process.platform === "win32";

  const appDataPath =
    os.platform() === "win32" ? process.env.LOCALAPPDATA : "PLM";

  const pluginPath = isWin
    ? appDataPath + `\\Logi\\PluginFramework\\plugins\\logi_test_plugin\\`
    : `${process.env.HOME}/Library/Application Support/Logitech/Logitech Options/Plugins/`;

  vscode.window.showInformationMessage(pluginPath);

  // await fs.ensureDir(pluginPath);
  fs.mkdirSync(pluginPath, { recursive: true, overwrite: true });
  await fs.copy(__dirname + "\\manifest.json", pluginPath + "manifest.json", {
    overwrite: true,
  });
};