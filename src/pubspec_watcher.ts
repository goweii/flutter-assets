import * as vscode from "vscode";
import { assetsConfig } from "./assets_config";
import { assetsGenerator } from "./assets_generator";
import { assetsWatcher } from "./assets_watcher";

class PubspecWatcher {
    private pubspecName = 'pubspec.yaml';
    private watcher?: vscode.FileSystemWatcher;

    private timeout?: NodeJS.Timeout;

    startWatch() {
        this.stopWatch();
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) { return; }
        const workspaceFolder = workspaceFolders[0];

        this.watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(workspaceFolder.uri, this.pubspecName));

        this.watcher.onDidCreate((uri) => this.onEvent(uri));
        this.watcher.onDidChange((uri) => this.onEvent(uri));
        this.watcher.onDidDelete((uri) => this.onEvent(uri));

        console.log(`start watching '${this.pubspecName}'`);
    }

    stopWatch() {
        if (this.watcher === undefined) { return; }
        this.watcher.dispose();
        this.watcher = undefined;
        console.log(`stop watch '${this.pubspecName}'`);
    }

    private onEvent(uri: vscode.Uri) {
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.timeout = setTimeout(async () => {
            await assetsConfig.update();
            if (assetsConfig.autoGenerate) {
                await assetsGenerator.generate();
                assetsWatcher.startWatch();
            } else {
                assetsWatcher.stopWatch();
            }
        }, 1000);
    }
}

export var pubspecWatcher = new PubspecWatcher();