import * as vscode from 'vscode';
import { assetsConfig } from "./assets_config";
import { assetsGenerator } from './assets_generator';

export function registerAllCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-assets.generate-now', async (e) => {
            await assetsGenerator.generate();
            return true;
        }),
        vscode.commands.registerCommand('flutter-assets.update-config-now', async (e) => {
            await assetsConfig.update();
            return true;
        }),
    );
}