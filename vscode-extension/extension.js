// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const LogiClient = require('logi-plugin-sdk');

const fs = require('fs-extra');
const os = require('os');

function eventIdToConfigurationProperty(eventId) {
    switch (eventId) {
        case 'mx-master-3s-2b034_c86':
            return 'MX\u0020Master\u00203\u0008S.forwardButton';
        case 'mx-master-3s-2b034_c83':
            return 'MX\u0020Master\u00203\u0008S.backButton';
        case 'mx-master-3s-2b034_c82':
            return 'MX\u0020Master\u00203\u0008S.middleButton';
        case 'mx-master-3s-2b034_c195':
            return 'MX\u0020Master\u00203\u0008S.thumbButton';
        case 'mx-master-3s-2b034_c196':
            return 'MX\u0020Master\u00203\u0008S.topButton';
    }
}

function configurationPropertyToAction(configurationProperty) {
    let config = vscode.workspace.getConfiguration('Logitech').get(configurationProperty);

    switch (config) {
        case 'Go to definition':
            goToDefinition();
            console.log(config);
            return;
        case 'Iterate through iterators forward':
            iterateThroughIdentifiersForward();
            console.log(config);
            return;
        case 'Iterate through iterators backward':
            iterateThroughIdentifiersBackward();
            console.log(config);
            return;
    }
}

function eventIdToAction(eventId) {
    let configurationProperty = eventIdToConfigurationProperty(eventId);
    configurationPropertyToAction(configurationProperty);
}

function iterateThroughIdentifiersForward() {
    const editor = vscode.window.activeTextEditor;
    let cursorPosition = editor.selection.start;
    let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);

    vscode.commands.executeCommand('editor.action.wordHighlight.next', wordRange);
}

function iterateThroughIdentifiersBackward() {
    const editor = vscode.window.activeTextEditor;
    let cursorPosition = editor.selection.start;
    let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);

    vscode.commands.executeCommand('editor.action.wordHighlight.previous', wordRange);
}

function goToDefinition() {
    const editor = vscode.window.activeTextEditor;
    let cursorPosition = editor.selection.start;
    let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);

    vscode.commands.executeCommand('editor.action.goToDeclaration', wordRange);
}

function activate(context) {
    const isInitialInstall = context.globalState.get("isInitialInstall", true);

    // Change to true/false for debugging
    if (isInitialInstall) {
        // Show a welcome message
        vscode.window.showInformationMessage("Installing!");
        install();
        // Update the global state so that the welcome message won't be shown again
        context.globalState.update("isInitialInstall", false);
    }  

    const initialData = {
        pluginId: "logi_code_extend",
        pluginCode: "123",
        pluginVersion: "1.2.3",
    };

    const clientApp = new LogiClient(initialData);
    clientApp.init();

    const FIRST_BUTTON = "mx-master-3s-2b034_c86";
    const SECOND_BUTTON = "mx-master-3s-2b034_c83";
    const SCROLL_BUTTON = "mx-master-3s-2b034_c82";
    const THUMB_BUTTON = "mx-master-3s-2b034_c195";
    const PROFILE_BUTTON = "mx-master-3s-2b034_c196";

    clientApp.onTriggerAction = async ({ id, message }) => {
        // console.log('onTriggerAction', id, message);

        vscode.window.showInformationMessage("Triggered...!");


        switch (message.actionInstanceId) {
        case FIRST_BUTTON:
            // console.log("First button pressed");
            break;
        case SECOND_BUTTON:
            // console.log("Second button pressed");
            break;
        case SCROLL_BUTTON:
            // console.log("Scroll button pressed");
            break;
        case PROFILE_BUTTON:
            console.log("Profile button pressed");

            break;
        case THUMB_BUTTON:
            console.log("Thumb button pressed");
            break;
        default:
            console.log(message);
        }
    };

    clientApp.onUpdateAnalogControl = async ({ id, message }) => {
        // message.delta = direction of the wheel
        // > 0 => going up, < -0 => going down
        // console.log('onUpdateAnalogControl', id, message);
        console.log("Wheel moved");
        vscode.window.showInformationMessage("Wheel moved...!");
    };
}

// This method is called when your extension is deactivated
function deactivate() {}



// export {
// 	activate,
// 	deactivate,
// }
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

module.exports = {
  activate,
  deactivate,
};