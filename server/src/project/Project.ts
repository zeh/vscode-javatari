import {
	TextDocument,
} from "vscode-languageserver";

import { IDasmResult } from "dasm";
import SimpleSignal from "simplesignal";

import Assembler from "./../providers/Assembler";
import ProjectFiles from "./ProjectFiles";
import { IProjectFile } from "./ProjectFiles";

export default class Project {

	private _files:ProjectFiles;
	private _results?:IDasmResult;
	private _onAssembled:SimpleSignal<(project:Project) => void>;
	private _onChangedFiles:SimpleSignal<(project:Project) => void>;

	constructor() {
		this._onAssembled = new SimpleSignal<(project:Project) => void>();
		this._onChangedFiles = new SimpleSignal<(project:Project) => void>();

		this._files = new ProjectFiles();
		this._files.onChanged.add(() => {
			this.assemble();
		});
		this._files.onAdded.add(() => {
			this._onChangedFiles.dispatch(this);
		});

		this._results = undefined;
	}

	public addFile(document:TextDocument) {
		this._files.addFromDocument(document);
	}

	public debug_logProject() {
		this._files.debug_logProject();
	}

	public updateFile(document:TextDocument) {
		this._files.updateFromDocument(document);
	}

	public markFileSaved(document:TextDocument) {
		this._files.markSaved(document);
	}

	public markFileClosed(document:TextDocument) {
		this._files.markClosed(document);
	}

	public hasFile(uri:string) {
		return this._files.has(uri);
	}

	public getAssemblerResults():IDasmResult|undefined {
		return this._results;
	}

	public getEntryFileInfo() {
		return this._files.getEntry();
	}

	public getFileInfo(uri:string) {
		return this._files.get(uri);
	}

	public getFileInfoLocalUri(parentRelativeUri:string) {
		return this._files.getByDependencyUri(undefined, parentRelativeUri);
	}

	public getFiles():IProjectFile[] {
		return this._files.all();
	}

	public get onAssembled() {
		return this._onAssembled;
	}

	public get onChangedFiles() {
		return this._onChangedFiles;
	}

	public dispose() {
		this._onAssembled.removeAll();
		this._onChangedFiles.removeAll();
		this._results = undefined;
		this._files.dispose();
	}

	private assemble() {
		// Gather all files and compile
		const source = this._files.getSource();
		const includes = this._files.getIncludes();
		if (source && includes) {
			console.time("[project] Assembling");
			this._results = Assembler.assemble(source, includes);
			this._onAssembled.dispatch(this);
			console.timeEnd("[project] Assembling");
		} else {
			console.warn("[project] No entry file to compile");
		}
	}
}

