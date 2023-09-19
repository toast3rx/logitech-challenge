# Logitech Supercharges VSCode

This project was created as part of the HackZurich 2023 Hackathon. This VSCode extension allows customizing detailed behavior for all Logitech's special controls: mouse buttons and wheels, keyboard keys, deck controls etc. Each device control can be mapped to any existing functionality in VSCode or any extension in the ecosystem.

### Features
Right now the extension supports the following devices:
- Logitech MX Master 3
- Logitech MX Keys

### How it works
The extension uses the [Logitech Options+](https://www.logitech.com/en-us/software/logi-options-plus.html) SDK.
It copies a ```manifest.json``` file at `%appdata%\Local\Logi\PluginFramework\Plugins` on Windows or at ```/Users/<username>/Library/Application Support/LogiPluginFramework/plugins``` witch represents the main entry point to the options+ plugin. It contains a plugin description and it will show what components are available.
The extension will act as the plugin and will communicate with the options+ sdk through a websocket.

### Project structure
- `sdk/` - symlink to the Logitech Options+ SDK.
- `logi-plugin-sdk-js/` - javascript implementation of the Logitech Options+ SDK.
- `logi-plugin-sdk-python/` - python implementation of the Logitech Options+ SDK. __Still in progress__
- `vscode-extension/` - implementation of the VSCode extension.

### How to run
- Install the Logitech Options+ app.
- Switch on _Plugin Development Mode_ in the app's settings.
- Clone the repo.
- Run `npm install` in the `logi-plugin-sdk-js/` folder.
- Run `npm install` in the `vscode-extension/` folder.
- Run the extension in VSCode.
- On the extension's settings page, you can add shortcuts for the devices' buttons.

## TODOs
- [ ] Delete the `sdk/` symlink once everybody uses `logi-plugin-sdk-js`.
