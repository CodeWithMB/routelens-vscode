import * as vscode from "vscode";

export interface WorkspaceScanResult {
    totalFiles: number;
    typescriptFiles: number;
    javascriptFiles: number;
    discoveredFiles: string[];

    routeFiles: string[];
    middlewareFiles: string[];
    controllerFiles: string[];
    serviceFiles: string[];
}

export async function detectHttpMethods(
    routeFiles: string[]
): Promise<Record<string, string[]>> {

    const methods = ["get", "put", "post", "delete", "patch"];
    const detectedRoutes: Record<string, string[]> = {};

    for (const file of routeFiles) {

        const uri = vscode.Uri.file(file);

        const extractedFile = await vscode.workspace.fs.readFile(uri);

        const content = Buffer.from(extractedFile).toString("utf-8");

        const detectedMethods = methods.filter((method) => {
            return content.includes(`router.${method}`);
        });

        detectedRoutes[file] = detectedMethods;
    }
    return detectedRoutes;
}
export async function scanWorkspace(): Promise<WorkspaceScanResult> {
    const files = await vscode.workspace.findFiles(
        "**/*.{ts,js}",
        "**/node_modules/**"
    );

    const discoveredFiles = files.map(file => file.fsPath);

    const normalizedFiles = discoveredFiles.map(
        file => file.replace(/\\/g, "/").toLowerCase()
    );

    const routeFiles = discoveredFiles.filter((file, index) => {
        const normalizedPath = normalizedFiles[index];
        const fileName = normalizedPath.split("/").pop() ?? "";

        return (
            normalizedPath.split("/").includes("routes") ||
            /\.routes\.(ts|js)$/.test(fileName)
        );
    });

    const middlewareFiles = discoveredFiles.filter((file, index) => {
        const normalizedPath = normalizedFiles[index];
        const fileName = normalizedPath.split("/").pop() ?? "";

        return (
            normalizedPath.split("/").includes("middleware") ||
            /\.middleware\.(ts|js)$/.test(fileName)
        );
    });

    const controllerFiles = discoveredFiles.filter((file, index) => {
        const normalizedPath = normalizedFiles[index];
        const fileName = normalizedPath.split("/").pop() ?? "";

        return (
            normalizedPath.split("/").includes("controllers") ||
            /\.controller\.(ts|js)$/.test(fileName)
        );
    });

    const serviceFiles = discoveredFiles.filter((file, index) => {
        const normalizedPath = normalizedFiles[index];
        const fileName = normalizedPath.split("/").pop() ?? "";

        return (
            normalizedPath.split("/").includes("services") ||
            /\.service\.(ts|js)$/.test(fileName)
        );
    });

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
        discoveredFiles,

        routeFiles,
        middlewareFiles,
        controllerFiles,
        serviceFiles
    };
}

export interface DiscoveredRoute {
    file: string;
    method: string;
    path: string;
}

export async function extractEndpoints(
    routeFiles: string[]
): Promise<DiscoveredRoute[]> {
    const discoveredRoutes: DiscoveredRoute[] = [];
    const routePattern =
        /\brouter\.(get|post|put|patch|delete)\s*\(\s*(['"])(.*?)\2/g;
    for (const file of routeFiles) {
        const uri = vscode.Uri.file(file);
        const fileContent = await vscode.workspace.fs.readFile(uri);
        const content = Buffer.from(fileContent).toString("utf-8");
        const matches = content.matchAll(routePattern);
        for (const match of matches) {
            discoveredRoutes.push({
                file: file,
                method: match[1].toUpperCase(),
                path: match[3]
            });
        }
    }
    return discoveredRoutes;
}
