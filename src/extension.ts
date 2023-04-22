import * as vscode from 'vscode';
import { registerAllCommands } from './main/commands';
import { Config } from './main/config';
import { Log } from './main/log';
import { AssetsWatcher } from './main/assets_watcher';

export function activate(context: vscode.ExtensionContext) {
	Log.i('Extension is activate');
	Config.instance.update();
	registerAllCommands(context);
	AssetsWatcher.instance.startWatch();
}

export function deactivate() {
	Log.i('Extension is deactivated');
	AssetsWatcher.instance.stopWatch();
}
