import dasm from "dasm";

export interface ISymbol {
	name: string;
	isLabel: boolean;
	isConstant: boolean;
	value: number;
	wasReferenced: boolean;
	wasPseudoOpCreated: boolean;
}

export interface ILine {
	number: number;
	address: number;
	bytes: Uint8Array | undefined;
	raw: string;
	errorMessage: string | undefined;
	comment: string | undefined;
	command: string | undefined;
}

export interface IAssemblerResult {
	data: Uint8Array;
	output: string[];
	list: ILine[] | undefined;
	listRaw: string | undefined;
	symbols: ISymbol[] | undefined;
	symbolsRaw: string | undefined;
	exitStatus: number;
	success: boolean;
};

export class Assembler {

	constructor() {
	}

	public assemble(src:string):IAssemblerResult {
		console.time("[server] Compile");
		console.log("[server] Source length is " + src.length);
		const result = dasm(src, { format: 3 });
		console.timeEnd("[server] Compile");
		console.log("[assembler] ROM length is ", result.data.length);

		return result;
	}
}

export default Assembler;
