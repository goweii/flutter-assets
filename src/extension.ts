import * as vscode from 'vscode';
import { registerAllCommands } from './commands';
import { assetsConfig } from './assets_config';
import { assetsWatcher } from './assets_watcher';
import { pubspecWatcher } from './pubspec_watcher';
import { assetsGenerator } from './assets_generator';

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
