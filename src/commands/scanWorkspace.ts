import * as vscode from "vscode";
import { scanWorkspace, detectHttpMethods, extractEndpoints } from "../services/workspaceScanner.js";

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
        const detectedRoutes = await detectHttpMethods(result.routeFiles);
        const endpoints = await extractEndpoints(result.routeFiles);
        console.log("Detected HTTP methods:", detectedRoutes);
        console.log("Discovered API endpoints:", endpoints);
        const totalDetectedMethods = Object.values(detectedRoutes)
            .flat()
            .length;
        vscode.window.showInformationMessage(
            `RouteLens: ${result.totalFiles} files | Routes: ${result.routeFiles.length} | HTTP Methods: ${totalDetectedMethods} | Endpoints: ${endpoints.length} | Middleware: ${result.middlewareFiles.length} | Controllers: ${result.controllerFiles.length} | Services: ${result.serviceFiles.length}`
        );

    } catch (error) {
        vscode.window.showErrorMessage(
            "RouteLens: Failed to scan workspace."
        );

        console.error("RouteLens scanning error:", error);
    }
}
