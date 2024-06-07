import { EditorModuleWrapper } from "./editorModuleWrapper"
import { createEditorStore } from "./editorStore"
import MainModuleFactory from "./interface"
import { Signal } from "./signal"

declare global {
	interface Window {
		__editor_callbacks__: {
			onInitialized: () => void
			onInitializationStageChange: (stage: string) => void
			onEngineError: (cuase: string) => void
			onEntityUpdate: (entityId: number, kind: EntityUpdateKind) => void
			onGlobalUpdate: (kind: GlobalUpdateKind, data?: number) => void
		}

		__editor_module_factory__: typeof MainModuleFactory

		__editor_module__: EditorModuleWrapper
	}

	interface HTMLCanvasElement {
		_width: number
		_height: number
	}
}

export enum EditorMode {
	ObjectMode,
	EditMode,
	SculptMode,
}

export enum EntityUpdateKind {
	Position,
	Rotation,
	Scale,
	Visibility,
	Parent,
	Children,
	Removed,
}

export enum GlobalUpdateKind {
	Time,
	RenderTarget,
}

export type EditorProviderProps = {
	children?: React.ReactNode
} & Partial<EditorState>

export enum ComponentType {
	Position,
	Scale,
	Orientation,
}

export type ComponentTypeToComponentStructure<T> = T extends ComponentType.Position
	? Vec3
	: T extends ComponentType.Scale
	? Vec3
	: T extends ComponentType.Orientation
	? Quat
	: never

export type ComponentActor<T> = {
	getter: (entityId: number) => ComponentTypeToComponentStructure<T>
	setter: (entityId: number, value: Partial<ComponentTypeToComponentStructure<T>>) => void
}

export type EntityUpdateListener = {
	entityId: number
	kind: EntityUpdateKind
	callback: () => void
	extraData?: number
}
export type GlobalUpdateListener = {
	kind: GlobalUpdateKind
	callback: () => void
	extraData?: number
}

export type EditorState = {
	isMultisampled: boolean
	selectedEntities: Set<number>
	lastSelectedEntity: number | null
	onInFlightOperationFinishedSignal: Signal
	initializationStage: string
	onInitSignal: Signal
	engineError: Error | null
	interactionMode: EditorMode
	entityUpdateListeners: Set<EntityUpdateListener>
	globalUpdateListeners: Set<GlobalUpdateListener>
	componentActors: Map<
		ComponentType,
		{ getter: (entityId: number) => any; setter: (entityId: number, value: any) => void }
	>
}
export type EditorActions = {
	selectEntity: (entityId: number) => void
	unselectEntity: (entityId: number) => void
	clearSelection: () => void
	createRenderOutput: () => void
	deleteRenderOutput: () => void
	setInitializationStage: (newStageName: string) => void
	setEngineError: (cause: string) => void
	clearEngineError: () => void
	subscribeToEntityUpdate: (
		entityId: number,
		kind: EntityUpdateKind,
		callback: () => void
	) => () => void
	dispatchEntityUpdate: (entityId: number, kind: EntityUpdateKind) => void
	subscribeToGlobalUpdate: (
		kind: GlobalUpdateKind,
		callback: () => void,
		extraData?: number
	) => () => void
	dispatchGlobalUpdate: (kind: GlobalUpdateKind, data?: number) => void
}

export type WithSelectors<S> = S extends { getState: () => infer T }
	? S & {
			use: {
				[K in keyof T]: () => T[K]
			}
	  }
	: never

export type Vec3 = {
	x: number
	y: number
	z: number
}

export type Vec2 = {
	x: number
	y: number
}

export type Quat = {
	x: number
	y: number
	z: number
	w: number
}

export type Vec4 = Quat

export type UvSphereCreateOptions = {
	radius: number
	longitudeSegmentCount: number
	latitudeSegmentCount: number
}

export type TorusCreateOptions = {
	majorRadius: number
	minorRadius: number
	segmentCount: number
	ringCount: number
}

export type CubeCreateOptions = {
	size: number
}

export type CylinderCreateOptions = {
	radius: number
	height: number
	segmentCount: number
	verticalOffset: number
}

export type ConeCreateOptions = {
	radius: number
	segmentCount: number
	height: number
	verticalOffset: number
}

export type PlaneCreateOptions = {
	width: number
	height: number
}

export enum EntityInterface {
	None = 0,
	Mesh,
	Camera,
	Light,
	Scene,
}

export type OrientationGizmoData = {
	x: Vec3
	y: Vec3
	z: Vec3
	"-x": Vec3
	"-y": Vec3
	"-z": Vec3
}

export type EditorContextType = {
	store: ReturnType<typeof createEditorStore>
	editorModule: EditorModuleWrapper
}

export type EntityInfo = {
	entityName: string
	entityInterface: EntityInterface
}
