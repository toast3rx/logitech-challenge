const vscode = require('vscode');
const LogiClient = require('logi-plugin-sdk');

const fs = require('fs-extra');
const os = require('os');

// mouse
const FORWARD_BUTTON = "mx-master-3s-2b034_c86";
const BACK_BUTTON = "mx-master-3s-2b034_c83";
const MIDDLE_BUTTON = "mx-master-3s-2b034_c82";
const THUMB_BUTTON = "mx-master-3s-2b034_c195";
const TOP_BUTTON = "mx-master-3s-2b034_c196";
// keyboard
const F1_BUTTON = "mx-mechanical-2b366_c199"
const F2_BUTTON = "mx-mechanical-2b366_c200"
const F3_BUTTON = "mx-mechanical-2b366_c226"
const F4_BUTTON = "mx-mechanical-2b366_c227"
const F5_BUTTON = "mx-mechanical-2b366_c259"  // openFiles
const F6_BUTTON = "mx-mechanical-2b366_c264"
const F7_BUTTON = "mx-mechanical-2b366_c266"
const F8_BUTTON = "mx-mechanical-2b366_c284"
const F9_BUTTON = "mx-mechanical-2b366_c228"
const F10_BUTTON = "mx-mechanical-2b366_c229"
const F11_BUTTON = "mx-mechanical-2b366_c230"
const F12_BUTTON = "mx-mechanical-2b366_c231"
const VOLUME_DOWN_BUTTON = "mx-mechanical-2b366_c232"
const VOLUME_UP_BUTTON = "mx-mechanical-2b366_c233"
const INSERT_BUTTON = "mx-mechanical-2b366_c278"
const HOME_BUTTON = "mx-mechanical-2b366_c280"
const END_BUTTON = "mx-mechanical-2b366_c281"
const PAGE_DOWN_BUTTON = "mx-mechanical-2b366_c283"
const PAGE_UP_BUTTON = "mx-mechanical-2b366_c282"
const NUMLOCK_BUTTON = "mx-mechanical-2b366_c10"
const PROJECT_BUTTON = "mx-mechanical-2b366_c110"
const SEARCH_BUTTON = "mx-mechanical-2b366_c212"  // askGPT
const LOCK_BUTTON = "mx-mechanical-2b366_c111"

const eventIdMap = {
	[FORWARD_BUTTON]: 'MX\u0020Master\u00203\u0008S.forwardButton',
	[BACK_BUTTON]: 'MX\u0020Master\u00203\u0008S.backButton',
	[MIDDLE_BUTTON]: 'MX\u0020Master\u00203\u0008S.middleButton',
	[THUMB_BUTTON]: 'MX\u0020Master\u00203\u0008S.thumbButton',
	[TOP_BUTTON]: 'MX\u0020Master\u00203\u0008S.topButton',
	// keyboard
	[F1_BUTTON]: 'MX\u0020Mechanical.f1',
	[F2_BUTTON]: 'MX\u0020Mechanical.f2',
	[F3_BUTTON]: 'MX\u0020Mechanical.f3',
	[F4_BUTTON]: 'MX\u0020Mechanical.f4',
	[F5_BUTTON]: 'MX\u0020Mechanical.f5',
	[F6_BUTTON]: 'MX\u0020Mechanical.f6',
	[F7_BUTTON]: 'MX\u0020Mechanical.f7',
	[F8_BUTTON]: 'MX\u0020Mechanical.f8',
	[F9_BUTTON]: 'MX\u0020Mechanical.f9',
	[F10_BUTTON]: 'MX\u0020Mechanical.f10',
	[F11_BUTTON]: 'MX\u0020Mechanical.f11',
	[F12_BUTTON]: 'MX\u0020Mechanical.f12',
	[VOLUME_DOWN_BUTTON]: 'MX\u0020Mechanical.volumeDown',
	[VOLUME_UP_BUTTON]: 'MX\u0020Mechanical.volumeUp',
	[INSERT_BUTTON]: 'MX\u0020Mechanical.insert',
	[HOME_BUTTON]: 'MX\u0020Mechanical.home',
	[PAGE_DOWN_BUTTON]: 'MX\u0020Mechanical.end',
	[PAGE_DOWN_BUTTON]: 'MX\u0020Mechanical.pageDown',
	[PAGE_UP_BUTTON]: 'MX\u0020Mechanical.pageUp',
	[NUMLOCK_BUTTON]: 'MX\u0020Mechanical.numLock',
	[PROJECT_BUTTON]: 'MX\u0020Mechanical.project',
	[SEARCH_BUTTON]: 'MX\u0020Mechanical.search',
	[LOCK_BUTTON]: 'MX\u0020Mechanical.lock',
}

// -----------------------
// Utils
// -----------------------

function eventIdToConfigurationProperty(eventId) {
    return eventIdMap[eventId];
}


openGptPrompt = () => {
// 	const searchQuery = await vscode.window.showInputBox({
//   placeHolder: "Search query",
//   prompt: "Search my snippets on Codever",
//   value: selectedText
// });
}

function configurationPropertyToAction(configurationProperty) {
    let config = vscode.workspace.getConfiguration('Logitech').get(configurationProperty);
    vscode.commands.executeCommand(config);
}

function eventIdToAction(eventId) {
    let configurationProperty = eventIdToConfigurationProperty(eventId);
    configurationPropertyToAction(configurationProperty);
}

// -----------------------
// Action handlers
// -----------------------

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

function openFiles() {
    const options = {
        canSelectMany: true,
        openLabel: 'Open',
   };

   vscode.window.showOpenDialog(options).then(fileUri => {
       if (fileUri && fileUri[0]) {
           console.log('Selected file: ' + fileUri[0].fsPath);
       }
   });
}

function selectMultiple() {

}

function openEmojiPicker(context) {
    let disposable = vscode.commands.registerCommand('extension.emoji', () => {
        console.log("test");
        console.log($(function() {
            var e = $.Event('keypress');
            e.which = 65; // Character 'A'
            $('item').trigger(e);
        }));
    });

    context.subscriptions.push(disposable);
}

class GptCaller {
    openai;
    messages = [];

    constructor(apiKey) {
        const configuration = new Configuration({
            apiKey: apiKey,
        });
        const openai = new OpenAIApi(configuration);
        this.openai = openai;
    }

    async askChatGPT(requestText) {
        this.messages.push({
            role: "user",
            content: requestText
        });

        if (this.openai === null || this.openai === undefined) {
            console.log("No openai");
            return "";
        }

        const completion = await this.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: this.messages
        });
        const res = completion.data.choices[0].message;
        this.messages.push(res);

        return res.content;
    }
}
/**
 * Prototype function to ask GPT 
 */
function askGPT() {
    // let apiKey = vscode.workspace.getConfiguration('Logitech').get("Logitech.MX\u0020Mechanical.search.chatGPT");
    // if (apiKey === "") {
    //     console.log("You need to provide an API Key");
    //     return;
    // }

    vscode.env.openExternal("https://chat.openai.com");
}

// -----------------------
// Activate (run extension)
// -----------------------

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

    // openEmojiPicker(context);

    // let disposable = vscode.commands.registerCommand('logitech.emoji', () => {
    //     console.log("test");
    //     let keystrokeEvent = new KeyboardEvent("keypress", key = "a");
    // });
    // context.subscriptions.push(disposable);

    let definitionDisposable = vscode.commands.registerCommand('logitech.goToDefinition', () => {
        goToDefinition();
    });
    context.subscriptions.push(definitionDisposable);

    let forwardIterateDisposable = vscode.commands.registerCommand('logitech.iterateThroughIdentifiersForward', () => {
        iterateThroughIdentifiersForward();
    });
    context.subscriptions.push(forwardIterateDisposable);

    let backwardIterateDisposable = vscode.commands.registerCommand('logitech.iterateThroughIdentifiersBackward', () => {
        iterateThroughIdentifiersBackward();
    });
    context.subscriptions.push(backwardIterateDisposable);

    let GPTDisposable = vscode.commands.registerCommand('logitech.askGPT', () => {
        askGPT();
    });
    context.subscriptions.push(GPTDisposable);

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

const install = async () => {
  const isWin = process.platform === "win32";

  const appDataPath =
    os.platform() === "win32" ? process.env.LOCALAPPDATA : "PLM";

  const pluginPath = isWin
    ? appDataPath + `\\Logi\\PluginFramework\\plugins\\logi_test_plugin\\`
    : `${process.env.HOME}/Library/Application Support/Logitech/Logitech Options/Plugins/`;

  vscode.window.showInformationMessage(pluginPath);

  fs.mkdirSync(pluginPath, { recursive: true, overwrite: true });
  await fs.copy(__dirname + "\\manifest.json", pluginPath + "manifest.json", {
    overwrite: true,
  });
};

module.exports = {
  activate,
  deactivate,
};