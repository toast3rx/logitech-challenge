// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const LogiClient = require('logi-plugin-sdk');

const fs = require('fs-extra');
const os = require('os');

const eventIdMap = {
	'mx-master-3s-2b034_c86': 'MX\u0020Master\u00203\u0008S.forwardButton',
	'mx-master-3s-2b034_c83': 'MX\u0020Master\u00203\u0008S.backButton',
	'mx-master-3s-2b034_c82': 'MX\u0020Master\u00203\u0008S.middleButton',
	'mx-master-3s-2b034_c195': 'MX\u0020Master\u00203\u0008S.thumbButton',
	'mx-master-3s-2b034_c196': 'MX\u0020Master\u00203\u0008S.topButton',
	// keyboard
	'mx-mechanical-2b366_c199': 'MX\u0020Mechanical.f1',
	'mx-mechanical-2b366_c200': 'MX\u0020Mechanical.f2',
	'mx-mechanical-2b366_c226': 'MX\u0020Mechanical.f3',
	'mx-mechanical-2b366_c227': 'MX\u0020Mechanical.f4',
	'mx-mechanical-2b366_c259': 'MX\u0020Mechanical.f5',
	'mx-mechanical-2b366_c264': 'MX\u0020Mechanical.f6',
	'mx-mechanical-2b366_c266': 'MX\u0020Mechanical.f7',
	'mx-mechanical-2b366_c284': 'MX\u0020Mechanical.f8',
	'mx-mechanical-2b366_c228': 'MX\u0020Mechanical.f9',
	'mx-mechanical-2b366_c229': 'MX\u0020Mechanical.f10',
	'mx-mechanical-2b366_c230': 'MX\u0020Mechanical.f11',
	'mx-mechanical-2b366_c231': 'MX\u0020Mechanical.f12',
	'mx-mechanical-2b366_c232': 'MX\u0020Mechanical.volumeDown',
	'mx-mechanical-2b366_c233': 'MX\u0020Mechanical.volumeUp',
	'mx-mechanical-2b366_c278': 'MX\u0020Mechanical.insert',
	'mx-mechanical-2b366_c280': 'MX\u0020Mechanical.Home',
	'mx-mechanical-2b366_c282': 'MX\u0020Mechanical.pageUp',
	'mx-mechanical-2b366_c281': 'MX\u0020Mechanical.end',
	'mx-mechanical-2b366_c283': 'MX\u0020Mechanical.pageDown',
	'mx-mechanical-2b366_c10': 'MX\u0020Mechanical.numLock',
	'mx-mechanical-2b366_c110': 'MX\u0020Mechanical.project',
	'mx-mechanical-2b366_c212': 'MX\u0020Mechanical.search',
	'mx-mechanical-2b366_c111': 'MX\u0020Mechanical.lock',
}

function eventIdToConfigurationProperty(eventId) {
    return eventIdMap[eventId];
}

function configurationPropertyToAction(configurationProperty) {
    let config = vscode.workspace.getConfiguration('Logitech').get(configurationProperty);
	console.log(config);

    switch (config) {
        case 'Go to definition':
            goToDefinition();
            console.log(config);
            return;
        case 'Iterate through iterators forward':
			console.log(config);
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

    vscode.commands.executeCommand('editor.action.wordHighlight.prev', wordRange);
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

    clientApp.onTriggerAction = async (event) => {
        console.log('onTriggerAction', event);

        vscode.window.showInformationMessage("Triggered...!");

		eventIdToAction(event.message.actionInstanceId);
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