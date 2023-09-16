// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode from "vscode";
import os from "os"; 
import logi from "../logi-plugin-sdk-js/client.js";
import fs from "fs-extra";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let SDKClient;
 
async function loadModules() {
  const module = await import("./extension.mjs");
  SDKClient = module.default;
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
   await loadModules();
  const isInitialInstall = context.globalState.get("isInitialInstall", true);

  if (isInitialInstall) {
    // Show a welcome message
    vscode.window.showInformationMessage("Welcome to My Extension!");
    install();
    // Update the global state so that the welcome message won't be shown again
    context.globalState.update("isInitialInstall", false);
  }

  const initialData = {
    pluginId: "logi_code_extend",
    pluginCode: "123",
    pluginVersion: "1.2.3",
  };

  const FIRST_BUTTON = "mx-master-3s-2b034_c86";
  const SECOND_BUTTON = "mx-master-3s-2b034_c83";
  const SCROLL_BUTTON = "mx-master-3s-2b034_c82";
  const THUMB_BUTTON = "mx-master-3s-2b034_c195";
  const PROFILE_BUTTON = "mx-master-3s-2b034_c196";


  const clientApp = new logi(initialData6);
  clientApp.init();

  clientApp.onTriggerAction = async ({ id, message }) => {
    // console.log('onTriggerAction', id, message);

    switch (message.actionInstanceId) {
      case FIRST_BUTTON:
        // console.log("First button pressed");
        await open("https://wttr.in");
        break;
      case SECOND_BUTTON:
        // console.log("Second button pressed");
        await open("https://wttr.in");
        break;
      case SCROLL_BUTTON:
        // console.log("Scroll button pressed");
        await open("https://wttr.in");
        break;
      case PROFILE_BUTTON:
        console.log("Profile button pressed");
        await open("https://wttr.in");

        break;
      case THUMB_BUTTON:
        console.log("Thumb button pressed");
        await open("https://wttr.in");

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
  };
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

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

const main = require("./main-esm");
exports.activate = function (context) {
  main.activate(context);
};
