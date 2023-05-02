import * as vscode from 'vscode';
import * as yaml from 'yaml';

class AssetsConfig {
    static autoGenerateDef: boolean = false;
    static assetsPathDef: string = 'assets';
    static outputPathDef: string = 'lib/assets';
    static ignoreExtDef: boolean = false;

    autoGenerate: boolean = AssetsConfig.autoGenerateDef;
    assetsPath: string = AssetsConfig.assetsPathDef;
    outputPath: string = AssetsConfig.outputPathDef;
    ignoreExt: boolean = AssetsConfig.ignoreExtDef;

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

        this.autoGenerate = this.getBoolean(flutterAssets, 'auto-generate', AssetsConfig.autoGenerateDef);
        this.assetsPath = this.getString(flutterAssets, 'assets-path', AssetsConfig.assetsPathDef);
        this.outputPath = this.getString(flutterAssets, 'output-path', AssetsConfig.outputPathDef);
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