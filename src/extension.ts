import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    console.log("RouteLens extension is now active!");

    const disposable = vscode.commands.registerCommand(
        "routelens.helloWorld",
        () => {
            vscode.window.showInformationMessage(
                "Hello from RouteLens!"
            );
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}