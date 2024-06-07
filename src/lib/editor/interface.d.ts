// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
	/**
	 * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
	 * emscripten HEAP, returns a copy of that string as a Javascript String object.
	 *
	 * @param {number} ptr
	 * @param {number=} maxBytesToRead - An optional length that specifies the
	 *   maximum number of bytes to read. You can omit this parameter to scan the
	 *   string until the first 0 byte. If maxBytesToRead is passed, and the string
	 *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
	 *   string will cut short at that byte index (i.e. maxBytesToRead will not
	 *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
	 *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
	 *   JS JIT optimizations off, so it is worth to consider consistently using one
	 * @return {string}
	 */
	function UTF8ToString(ptr: number, maxBytesToRead?: number): string

	namespace Asyncify {
		function instrumentWasmImports(imports: any): void
		function instrumentWasmExports(exports: any): {}
		namespace State {
			let Normal: number
			let Unwinding: number
			let Rewinding: number
			let Disabled: number
		}
		let state: number
		let StackSize: number
		let currData: any
		let handleSleepReturnValue: number
		let exportCallStack: any[]
		let callStackNameToId: {}
		let callStackIdToName: {}
		let callStackId: number
		let asyncPromiseHandlers: any
		let sleepCallbacks: any[]
		function getCallStackId(funcName: any): any
		function maybeStopUnwind(): void
		function whenDone(): any
		function allocateData(): any
		function setDataHeader(ptr: any, stack: any, stackSize: any): void
		function setDataRewindFunc(ptr: any): void
		function getDataRewindFunc(ptr: any): any
		function doRewind(ptr: any): any
		function handleSleep(startAsync: any): any
		function handleAsync(startAsync: any): any
	}
	let wasmMemory: any
	function stringToNewUTF8(str: any): any
	let wasmExports: any
	let HEAPF32: any
	let HEAPF64: any
	let HEAP_DATA_VIEW: any
	let HEAP8: any
	let HEAPU8: any
	let HEAP16: any
	let HEAPU16: any
	let HEAP32: any
	let HEAPU32: any
	let HEAP64: any
	let HEAPU64: any
}
interface WasmModule {
	_main(_0: number, _1: number): number
	_stbi_image_free(_0: number): void
	_stbi_load(_0: number, _1: number, _2: number, _3: number, _4: number): number
	_stbi_load_from_memory(
		_0: number,
		_1: number,
		_2: number,
		_3: number,
		_4: number,
		_5: number
	): number
}

type EntityId = number

export interface vector<EntityId> {
	push_back(_0: number): void
	resize(_0: number, _1: number): void
	size(): number
	get(_0: number): number | undefined
	set(_0: number, _1: number): boolean
	delete(): void
}

interface EmbindModule {
	globalGetAppState(): number
	print_running_environment(): void
	entitiesRemoveEntity(_0: number): void
	entitiesCreateEntity(_0: number): number
	entitiesCreateCubeMesh(_0: number): number
	entitiesCreateConeMesh(_0: number): number
	entitiesCreateCylinderMesh(_0: number): number
	entitiesCreatePlaneMesh(_0: number): number
	entitiesCreateUVSphereMesh(_0: number): number
	entitiesCreateTorusMesh(_0: number): number
	entityGetPosition(_0: number): number
	entityGetOrientation(_0: number): number
	entityGetScale(_0: number): number
	entityGetInterface(_0: number): number
	entityGetName(_0: number): number
	meshShadeSmooth(_0: number): void
	meshShadeNormal(_0: number): void
	editorCreateRenderOutput(_0: number): void
	editorDeleteRenderOutput(_0: number): void
	editorUpdateRenderOutput(_0: number): void
	editorMoveCamera(_0: number, _1: number, _2: number, _3: number): void
	editorRotateCamera(_0: number, _1: number, _2: number): void
	editorGetRotationGizmoData(_0: number): number
	entityGetChildren(_0: number): vector<EntityId>
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule

export default function MainModuleFactory(options?: unknown): Promise<MainModule>
