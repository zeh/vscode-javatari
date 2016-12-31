import {
	commands,
	ExtensionContext,
	Uri,
	ViewColumn,
	window,
	workspace,
} from "vscode";

import JavatariDocumentContentProvider from "./JavatariDocumentContentProvider";

// https://code.visualstudio.com/docs/extensions/overview
// https://code.visualstudio.com/docs/extensionAPI/overview

export function activate(context:ExtensionContext) {
	// Only executed the first time an activationEvent command is triggered

	// Create a content provider for the preview tab
	const provider = new JavatariDocumentContentProvider(context);
	context.subscriptions.push(provider);
	workspace.registerTextDocumentContentProvider("javatari-preview", provider);

	// We need to add all objects to the list of subscriptions
	// Once the extension is deactivated, the references cease to exist
	// And they are garbage-collected
	let disposable = commands.registerCommand("vscode-javatarijs.openToTheSide", () => {
		openToTheSide(context);
	});
	context.subscriptions.push(disposable);

	console.log("vscode-javatarijs is now active.");
}

// Called when the extension is deactivated
export function deactivate() {
	console.log("vscode-javatarijs is now inactive.");
}

function openToTheSide(context:ExtensionContext) {
	openExampleGame(context)
		.then(result => {
			console.log("Document opened!");
		}, window.showErrorMessage);

	createPreviewTab(context)
		.then(result => {
			console.log("Editor shown!");
			//this.enterExampleGame();
		}, window.showErrorMessage);

	// TODO:
	// 2. Set the new tab with content from the previous tab (compiled)
	// 3. Watch for changes in the previously focused tab
	// 4. Update the new tab when changes are detected

	// Future:
	// * Syntax highlighting and autocompletion?
	// * Linting and automatic compilation?
	// * Side panel with compiled byte code?
	// * Code size on status bar?
}

function createPreviewTab(context:ExtensionContext) {
	let path = Uri.parse("javatari-preview://preview/filename");
	return commands.executeCommand("vscode.previewHtml", path, ViewColumn.Three);
}

function openExampleGame(context:ExtensionContext) {
	// Open a game source in the currently active tab
	// TODO: this is temporary, for testing purposes only
	const docPath = Uri.file(context.asAbsolutePath("assets/_test.asm"));
	return workspace.openTextDocument(docPath).then((doc) => {
		return window.showTextDocument(doc, ViewColumn.One);
	});
}
