import * as vscode from 'vscode';
import { assetsConfig } from "./assets_config";
import { assetsFileWriter } from './assets_file_writer';
import { AssetsNode } from './assets_node';
import { AssetsTemplate } from './assets_template';

class AssetsGenerator {
    async generate(): Promise<boolean> {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) { return false; }
            const workspaceFolder = workspaceFolders[0];

            const projectUri = workspaceFolder.uri;
            const assetsUri = vscode.Uri.joinPath(workspaceFolder.uri, assetsConfig.assetsPath);
            const outputDirUri = vscode.Uri.joinPath(projectUri, assetsConfig.outputPath);
            const outputFileUri = vscode.Uri.joinPath(outputDirUri, AssetsTemplate.assetsFileName);

            let fileContent = AssetsTemplate.filderHeaderString;
            fileContent += '\n\n';

            const stat = await vscode.workspace.fs.stat(assetsUri);
            if (stat.type !== vscode.FileType.Directory) {
                fileContent += AssetsTemplate.assetsNotDirErrorString;
            } else {
                const assetsNode = await AssetsNode.parseAssets(assetsUri);
                fileContent += assetsNode.toDartFileString(assetsConfig.ignoreExt);
            }
            fileContent += '\n';

            await assetsFileWriter.write(outputFileUri, fileContent);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

export var assetsGenerator = new AssetsGenerator();