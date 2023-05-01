import * as vscode from 'vscode';

class AssetsFileWriter {
    async write(outputPath: vscode.Uri, content: string) {
        const buffer = Buffer.from(content, 'utf-8');
        vscode.workspace.fs.writeFile(outputPath, buffer);
    }
}

export var assetsFileWriter = new AssetsFileWriter();