import * as vscode from 'vscode';
import * as yaml from 'yaml';
import { toUpperCamelCase } from './name_utils';

class AssetsConfig {
    static assetsPathDef: string = 'assets';
    static outputPathDef: string = 'lib/assets';
    static outputNameDef: string = 'assets';
    static ignoreExtDef: boolean = false;

    assetsPath: string = AssetsConfig.assetsPathDef;
    outputPath: string = AssetsConfig.outputPathDef;
    outputName: string = AssetsConfig.outputNameDef;
    ignoreExt: boolean = AssetsConfig.ignoreExtDef;

    get className(): string {
        return toUpperCamelCase(this.outputName.split('_'));
    }

    async update(): Promise<AssetsConfig> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            console.log('workspace folders is empty');
            return this;
        }

        const workspaceFolder = workspaceFolders[0];
        const yamlUri = vscode.Uri.joinPath(workspaceFolder.uri, "pubspec.yaml");

        let yamlContent;
        try {
            yamlContent = await vscode.workspace.fs.readFile(yamlUri);
        } catch {
            console.log('pubspec.yaml not exists: ' + yamlUri);
            return this;
        }

        const yamlObject = yaml.parse(yamlContent.toString());

        const flutterAssets = yamlObject['flutter-assets'];
        if (!flutterAssets) {
            console.log('flutter-assets undefined');
            return this;
        }

        this.assetsPath = this.getString(flutterAssets, 'assets-path', AssetsConfig.assetsPathDef);
        this.outputPath = this.getString(flutterAssets, 'output-path', AssetsConfig.outputPathDef);
        this.outputName = this.getString(flutterAssets, 'output-name', AssetsConfig.outputNameDef);
        this.ignoreExt = this.getBoolean(flutterAssets, 'ignore-ext', AssetsConfig.ignoreExtDef);

        console.log('assets config update: ', this);

        return this;
    }

    private getString(flutterAssets: any, name: string, def: string): string {
        const value = flutterAssets[name];
        if (value) {
            if (typeof value === 'string') {
                if (value.length > 0) {
                    return value;
                } else {
                    console.warn(`${name} is empty`);
                }
            } else {
                console.warn(`${name} not string`);
            }
        }
        return def;
    }

    private getBoolean(flutterAssets: any, name: string, def: boolean): boolean {
        const value = flutterAssets[name];
        if (value) {
            if (typeof value === 'boolean') {
                return value;
            } else {
                console.warn(`${name} not boolean`);
            }
        }
        return def;
    }
}

export var assetsConfig = new AssetsConfig();