import * as vscode from "vscode";
import { assetsConfig } from "./assets_config";
import { assetsGenerator } from "./assets_generator";

class AssetsWatcher {
    private watcher?: vscode.FileSystemWatcher;
    private watchingPath?: string;

    private timeout?: NodeJS.Timeout;

    startWatch() {
        this.stopWatch();
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) { return; }
        const workspaceFolder = workspaceFolders[0];

        this.watchingPath = assetsConfig.assetsPath;
        const assetsUri = vscode.Uri.joinPath(workspaceFolder.uri, this.watchingPath);
        this.watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(assetsUri, '**'));

        this.watcher.onDidCreate((uri) => this.onEvent(uri));
        this.watcher.onDidChange((uri) => this.onEvent(uri));
        this.watcher.onDidDelete((uri) => this.onEvent(uri));

        console.log(`start watching '${assetsConfig.assetsPath}'`);
    }

    stopWatch() {
        if (this.watcher === undefined) { return; }
        this.watcher.dispose();
        this.watcher = undefined;
        console.log(`stop watch '${this.watchingPath}'`);
    }

    private onEvent(uri: vscode.Uri) {
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.timeout = setTimeout(async () => {
            await assetsGenerator.generate();
        }, 1000);
    }
}

export var assetsWatcher = new AssetsWatcher();