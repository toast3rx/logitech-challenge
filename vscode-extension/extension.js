// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const LogiClient = require('logi-plugin-sdk');

function iterateThroughIdentifiers() {
    const editor = vscode.window.activeTextEditor;
    let cursorPosition = editor.selection.start;
    let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);

    vscode.commands.executeCommand('editor.action.wordHighlight.next', wordRange);
}

function goToDefinition() {
    const editor = vscode.window.activeTextEditor;
    let cursorPosition = editor.selection.start;
    let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);

    vscode.commands.executeCommand('editor.action.goToDeclaration', wordRange);
}

function activate(context) {
	console.log('Congratulations, your extension "logitech" is now active!');

    const editor = vscode.window.activeTextEditor;

    let identifierDisposable = vscode.commands.registerCommand('logitech.identifiers', async () => {
        let cursorPosition = editor.selection.start;
        let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);

        vscode.commands.executeCommand('editor.action.wordHighlight.next', wordRange);
    });

    let definitionDisposable = vscode.commands.registerCommand('logitech.definition', async () => {
        let cursorPosition = editor.selection.start;
        let wordRange = editor.document.getWordRangeAtPosition(cursorPosition);

        vscode.commands.executeCommand('editor.action.goToDeclaration', wordRange);
    });

	context.subscriptions.push(identifierDisposable);
	context.subscriptions.push(definitionDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

// export {
// 	activate,
// 	deactivate,
// }
