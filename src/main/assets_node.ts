import * as path from "path";
import * as vscode from "vscode";
import { toLowerSnakeCase, toSnakeCase } from "./name_utils";
import { toUpperCamelCase } from "./name_utils";

export class AssetsNode {
    name: string;

    parent: AssetsNode | undefined = undefined;
    children: AssetsNode[] | undefined = undefined;

    constructor(name: string) {
        this.name = name;
    }

    private get isRoot(): boolean {
        return this.parent === undefined;
    }

    private get isFolder(): boolean {
        return this.children !== undefined;
    }

    private get isFile(): boolean {
        return this.children === undefined;
    }

    private get pathFragments(): string[] {
        let paths = Array<string>();
        let node: AssetsNode | undefined = this;
        while (node !== undefined) {
            paths.unshift(node.name);
            node = node.parent;
        }
        return paths;
    }

    private get flutterAssetsPath(): string {
        return this.pathFragments.join('/');
    }

    private get nameWithoutExt(): string {
        const i = this.name.lastIndexOf('.');
        if (i < 0) { return this.name; }
        return this.name.substring(0, i);
    }

    private fieldName(ignoreExt: boolean): string {
        let name;
        if (ignoreExt) {
            name = this.nameWithoutExt;
        } else {
            name = this.name;
        }
        const splits = name.split(/[^0-9a-zA-Z]/);
        return toSnakeCase(splits);
    }

    private get isHiden(): boolean {
        return this.name.startsWith('.');
    }

    private get isVariant(): boolean {
        return this.name.match(/[0-9.]+?x|dark/) !== null;
    }

    private get className(): string {
        return toSnakeCase(this.pathFragments);
    }

    private get privateClassName(): string {
        return '_' + this.className;
    }

    private get darkVariant(): AssetsNode | undefined {
        if (this.isRoot) { return undefined; }
        return this.parent
            ?.children
            ?.find(e => e.name === 'dark')
            ?.children
            ?.find(e => e.name === this.name);
    }

    toDartFileString(
        className: string | undefined = undefined,
        ignoreExt: boolean = false
    ): string {
        if (className === undefined) {
            className = toUpperCamelCase(this.pathFragments);
        }

        let fileContent = `// ignore_for_file: unused_field, camel_case_types, non_constant_identifier_names, library_private_types_in_public_api\n\n`;
        fileContent += `import 'package:flutter/material.dart';\n\n`;

        fileContent += `extension ${className}Ext on BuildContext {\n`;
        fileContent += `  ${className} get ${toLowerSnakeCase([className])} {\n`;
        fileContent += `    final themeData = Theme.of(this);\n`;
        fileContent += `    return ${className}(\n`;
        fileContent += `      brightness: themeData.brightness,\n`;
        fileContent += `    );\n`;
        fileContent += `  }\n`;
        fileContent += `}\n`;

        const classContent = this.toDartClassString(className, ignoreExt);
        if (classContent !== undefined) {
            fileContent += '\n';
            fileContent += classContent;
        }

        return fileContent;
    }

    toDartClassString(
        className: string | undefined = undefined,
        ignoreExt: boolean = false
    ): string | undefined {
        if (!this.isFolder) {
            return undefined;
        }

        if (className === undefined) {
            className = toUpperCamelCase(this.pathFragments);
        }

        let classContent = `class ${className} {\n`;
        classContent += `  final Brightness _brightness;\n`;
        classContent += '\n';
        classContent += `  ${className}({\n`;
        classContent += `    required Brightness brightness,\n`;
        classContent += `  })  : _brightness = brightness`;

        this.children
            ?.filter(child => child.isFolder)
            ?.filter(child => !child.isHiden)
            ?.filter(child => !child.isVariant)
            ?.map((child) => {
                classContent += ',\n';
                classContent += `        ${child.fieldName(ignoreExt)} = ${child.privateClassName}(brightness: brightness)`;
            });

        classContent += ';\n';

        this.children
            ?.filter(child => child.isFolder)
            ?.filter(child => !child.isHiden)
            ?.filter(child => !child.isVariant)
            ?.map((child, index) => {
                if (index === 0) { classContent += '\n'; }
                classContent += `  final ${child.privateClassName} ${child.fieldName(ignoreExt)};\n`;
            });

        this.children
            ?.filter(child => child.isFile)
            ?.filter(child => !child.isHiden)
            ?.filter(child => !child.isVariant)
            ?.map((child, index) => {
                if (index === 0) { classContent += '\n'; }
                const darkVariant = child.darkVariant;
                if (darkVariant === undefined) {
                    classContent += `  final ${child.fieldName(ignoreExt)} = '${child.flutterAssetsPath}';\n`;
                } else {
                    classContent += `  String get ${child.fieldName(ignoreExt)} => _brightness == Brightness.light ? '${child.flutterAssetsPath}' : '${darkVariant.flutterAssetsPath}';\n`;
                }
            });

        classContent += `}\n`;

        this.children
            ?.filter(child => !child.isHiden)
            ?.filter(child => !child.isVariant)
            ?.filter(child => child.isFolder)
            ?.map((child) => {
                classContent += '\n';
                classContent += child.toDartClassString(child.privateClassName, ignoreExt);
            });

        return classContent;
    }

    static async parseAssets(rootUri: vscode.Uri): Promise<AssetsNode> {
        const rootName = path.basename(rootUri.fsPath);

        const stat = await vscode.workspace.fs.stat(rootUri);

        if (stat.type === vscode.FileType.File) {
            return new AssetsNode(rootName);
        }

        if (stat.type === vscode.FileType.Directory) {
            return this.parseAssetsNodeUnderFolder(rootUri, rootName);
        }

        throw URIError('root uri should be a file or folder');
    }

    private static async parseAssetsNodeUnderFolder(currentUri: vscode.Uri, currentName: string): Promise<AssetsNode> {
        const node = new AssetsNode(currentName);
        node.children = [];

        const children = await vscode.workspace.fs.readDirectory(currentUri);

        for (let i = 0; i < children.length; i++) {
            const [childName, childType] = children[i];
            const childPath = vscode.Uri.joinPath(currentUri, childName);

            if (childType === vscode.FileType.File) {
                const childNode = new AssetsNode(childName);
                childNode.parent = node;

                node.children.push(childNode);
            }

            if (childType === vscode.FileType.Directory) {
                const childNode = await this.parseAssetsNodeUnderFolder(childPath, childName);
                childNode.parent = node;

                node.children.push(childNode);
            }
        }

        return node;
    }
}