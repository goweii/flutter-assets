import * as vscode from 'vscode';
import { registerAllCommands } from './main/commands';
import { assetsConfig } from './main/assets_config';
import { assetsWatcher } from './main/assets_watcher';
import { pubspecWatcher } from './main/pubspec_watcher';
import { assetsGenerator } from './main/assets_generator';

export async function activate(context: vscode.ExtensionContext) {
	console.log('Extension is activate');

	registerAllCommands(context);

	await assetsConfig.update();
	await assetsGenerator.generate();

	pubspecWatcher.startWatch();
	assetsWatcher.startWatch();
}

export function deactivate() {
	console.log('Extension is deactivated');

	pubspecWatcher.stopWatch();
	assetsWatcher.stopWatch();
}
