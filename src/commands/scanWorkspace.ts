import * as vscode from "vscode";
import { scanWorkspace } from "../services/workspaceScanner.js";

export async function handleScanWorkspace(): Promise<void> {

    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage(
            "RouteLens: Please open a workspace before scanning."
        );
        return;
    }

    try {
        const result = await scanWorkspace();

        vscode.window.showInformationMessage(
            `RouteLens: Scan completed! Found ${result.totalFiles} files (${result.typescriptFiles} TypeScript, ${result.javascriptFiles} JavaScript).`
        );

    } catch (error) {
        vscode.window.showErrorMessage(
            "RouteLens: Failed to scan workspace."
        );

        console.error("RouteLens scanning error:", error);
    }
}
