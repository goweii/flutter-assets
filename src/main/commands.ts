import * as vscode from 'vscode';
import { Config } from "./config";
import { AssetsGenerator } from './assets_generator';

export function registerAllCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('flutter-assets.generate-now', async (e) => {
            Config.instance.update();
            AssetsGenerator.instance.generate();
            return true;
        }),
    );
}