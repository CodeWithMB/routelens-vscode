import * as vscode from "vscode";
import { handleScanWorkspace } from "./commands/scanWorkspace.js";

export function activate(context: vscode.ExtensionContext) {

    console.log("RouteLens extension is now active!");

    const scanWorkspaceCommand = vscode.commands.registerCommand(
        "routelens.scanWorkspace",
        handleScanWorkspace
    );

    context.subscriptions.push(scanWorkspaceCommand);
}

export function deactivate() {}
