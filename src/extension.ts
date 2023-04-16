import * as vscode from 'vscode';
import { registerAllCommands } from './main/commands';

export function activate(context: vscode.ExtensionContext) {
	console.log('[Flutter Assets] Extension is activate');

	registerAllCommands(context);
}

export function deactivate() {
	console.log('[Flutter Assets] Extension is deactivated');
}
