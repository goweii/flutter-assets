import * as vscode from 'vscode';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

export class Config {
    static instance = new Config();

    assetsPath: string = 'assets';
    outputPath: string = 'lib/assets';
    outputName: string = 'assets';
    ignoreExt: boolean = false;

    className = (): string => {
        let name = '';
        this.outputName.split('_').forEach((e) => {
            if (e.length === 0) { return; }
            if (e.length === 1) { name += e.toUpperCase(); }
            name += e[0].toUpperCase();
            name += e.substring(1);
        });
        return name;
    };

    toString = (): string => `Config {
        assetsPath: '${this.assetsPath}'
        outputPath: '${this.outputPath}'
        outputName: '${this.outputName}'
        ignoreExt: '${this.ignoreExt}'
    }`;

    update(): void {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) { return; }
        const workspaceFolder = workspaceFolders[0];
        console.log('[Flutter Assets] project: ' + workspaceFolder.uri.path);

        const yamlPath = path.join(workspaceFolder.uri.path, "pubspec.yaml");
        console.log('[Flutter Assets] pubspec.yaml: ' + yamlPath);

        if (!fs.existsSync(yamlPath)) {
            vscode.window.showErrorMessage('Flutter Assets: Not a flutter project!');
        }

        const yamlObject = yaml.parse(fs.readFileSync(yamlPath, 'utf8'));
        const yamlConfig = yamlObject['flutter-assets'];
        if (!yamlConfig) {
            console.info('[Flutter Assets] flutter-assets undefined');
            return;
        }

        const assetsPath: string = yamlConfig['assets-path'];
        if (assetsPath !== undefined && assetsPath.length > 0) { this.assetsPath = assetsPath; }
        const outputPath = yamlConfig['output-path'];
        if (outputPath !== undefined && outputPath.length > 0) { this.outputPath = outputPath; }
        const outputName = yamlConfig['output-name'];
        if (outputName !== undefined && outputName.length > 0) { this.outputName = outputName; }
        const ignoreExt = yamlConfig['ignore-ext'];
        if (ignoreExt !== undefined) { this.ignoreExt = ignoreExt; }

        console.info('[Flutter Assets] config: ' + this);
    }
}