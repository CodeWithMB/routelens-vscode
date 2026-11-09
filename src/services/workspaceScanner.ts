import * as vscode from "vscode";

export interface WorkspaceScanResult {
    totalFiles: number;
    typescriptFiles: number;
    javascriptFiles: number;
    discoveredFiles: string[];
}

export async function scanWorkspace(): Promise<WorkspaceScanResult> {
    const files = await vscode.workspace.findFiles(
        "**/*.{ts,js}",
        "**/node_modules/**"
    );

    const discoveredFiles = files.map(file => file.fsPath);

    const typescriptFiles = files.filter(
        file => file.fsPath.endsWith(".ts")
    ).length;

    const javascriptFiles = files.filter(
        file => file.fsPath.endsWith(".js")
    ).length;

    return {
        totalFiles: files.length,
        typescriptFiles,
        javascriptFiles,
        discoveredFiles
    };
}
