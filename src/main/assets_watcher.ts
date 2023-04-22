import * as chokidar from "chokidar";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { Config } from "./config";
import { Log } from "./log";
import { AssetsGenerator } from "./assets_generator";

export class AssetsWatcher {
    static instance = new AssetsWatcher();

    private dir?: string;
    private watcher?: chokidar.FSWatcher;

    private timeout?: NodeJS.Timeout;

    startWatch() {
        this.stopWatch();
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) { return; }
        const workspaceFolder = workspaceFolders[0];
        this.dir = path.join(workspaceFolder.uri.path, Config.instance.assetsPath);
        this.watcher = chokidar.watch(this.dir, {
            ignored: /(^|[\/\\])\..*$/
        }).on('all', this.onEvent);
        Log.d('startWatch');
    }

    stopWatch() {
        if (this.watcher === undefined) { return; }
        if (this.dir === undefined) { return; }
        this.watcher.close();
        this.watcher.unwatch(this.dir);
        this.watcher = undefined;
        Log.d('stopWatch');
    }

    private onEvent(
        eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
        path: string,
        stats?: fs.Stats
    ) {
        Log.d('onEvent', eventName, path, stats);
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.timeout = setTimeout(() => {
            AssetsGenerator.instance.generate();
        }, 500);
    }
}