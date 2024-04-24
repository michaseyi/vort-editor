import {
	ComponentType,
	HTMLAttributes,
	createContext,
	use,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"

export enum ECSEvent {
	ON_ENTITY_COMPONENT_CHANGE,
	ON_GLOBAL_VARIABLE_CHANGE,
	ON_ENTITY_CHILDCOUNT_CHANGE,
	ON_RUNTIME_INITIALIZED,
}

export enum EntityInterface {
	None = 0,
	Mesh,
	Camera,
	Light,
	Scene,
}
type EntityInfo = {
	name: string
	interface: EntityInterface
}

export type AppState = {
	initializationStage: string
	initialized: boolean
	running: boolean
}

declare let Vort: any
declare let UTF8ToString: (rawStringPtr: number) => string

export type ViewGizmoData = {
	X: [number, number, number]
	Y: [number, number, number]
	Z: [number, number, number]
	"-X": [number, number, number]
	"-Y": [number, number, number]
	"-Z": [number, number, number]
}
class VortECSInstance {
	public module: any

	private callbacks: Map<ECSEvent, Set<Function>> = new Map()

	public initialized: boolean = false

	private lastAppState: AppState = {
		initializationStage: "Creating World",
		running: true,
		initialized: false,
	}
	editorGetViewGizmoData(canvasSelectorPtr: number): ViewGizmoData {
		let gizmoDataPtr: number = this.module.editorGetRotationGizmoData(canvasSelectorPtr)

		let result: ViewGizmoData = {
			X: [
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 0),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 1),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 2),
			],
			Y: [
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 3),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 4),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 5),
			],
			Z: [
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 6),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 7),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 8),
			],
			"-X": [
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 9),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 10),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 11),
			],
			"-Y": [
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 12),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 13),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 14),
			],
			"-Z": [
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 15),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 16),
				this.module.HEAPF32.at(gizmoDataPtr / 4 + 17),
			],
		}

		return result
	}

	globalGetAppState(): AppState {
		// if (!this.initialized || this.module.Asyncify.asyncPromiseHandlers) {
		// 	return this.lastAppState
		// }

		// let appStatePtr = this.module.globalGetAppState()

		// if (appStatePtr instanceof Promise) {
		// 	return this.lastAppState
		// }

		// let initializationStagePtr = this.module.HEAPU32.at((appStatePtr / 4) | 0)

		// let initializationStage = this.module.UTF8ToString(initializationStagePtr)
		// let initialized = this.module.HEAP8.at(appStatePtr + 4) === 1
		// let running = this.module.HEAP8.at(appStatePtr + 4 + 1) === 1
		// this.lastAppState = { initializationStage, initialized, running }

		return this.lastAppState
	}
	entitiesRemoveEntity(entityID: number) {
		this.module.entitiesRemoveEntity(entityID)
	}

	editorRotateCamera(canvasSelectorPtr: number, pitch: number, yaw: number) {
		this.module.editorRotateCamera(canvasSelectorPtr, pitch, yaw)
	}

	editorMoveCamera(canvasSelectorPtr: number, xChange: number, yChange: number, zChange: number) {
		this.module.editorMoveCamera(canvasSelectorPtr, xChange, yChange, zChange)
	}

	entityGetChildren(entityID: number): number[] {
		const result: number[] = []

		const entityChildren = this.module.entityGetChildren(entityID)

		for (let i = 0; i < entityChildren.size(); i++) {
			result.push(entityChildren.get(i))
		}
		return result
	}

	entityGetInfo(entityID: number): EntityInfo {
		const entityInterface: EntityInterface = this.module.entityGetInterface(entityID)
		const entityNamePtr = this.module.entityGetName(entityID)
		const entityName = this.module.UTF8ToString(entityNamePtr)

		return { name: entityName, interface: entityInterface }
	}
	private dispatch<T extends ECSEvent>(eventType: T, eventData: ECSEventsCallbackArgument<T>) {
		console.log(eventType, eventData)
	}

	addEventListener<T extends ECSEvent>(
		eventType: T,
		callback: (event: ECSEventsCallbackArgument<T>) => void
	) {}

	removeEventListener<T extends ECSEvent>(
		eventType: T,
		callback: (event: ECSEventsCallbackArgument<T>) => void
	) {}
}

type ECSEventsCallbackArgument<T> = T extends ECSEvent.ON_ENTITY_COMPONENT_CHANGE
	? {
			entityID: number
			componentName: string
			componentValue: any
	  }
	: T extends ECSEvent.ON_GLOBAL_VARIABLE_CHANGE
	? {
			globalVariableName: string
			globalVariableValue: any
	  }
	: T extends ECSEvent.ON_RUNTIME_INITIALIZED
	? { initialized: boolean }
	: T extends ECSEvent.ON_ENTITY_CHILDCOUNT_CHANGE
	? {
			entityID: number
			children: number[]
	  }
	: never

enum VortEcsEvent {
	EntityUpdate,
}

const VortECSContext = createContext<VortECSInstance>({} as VortECSInstance)

export function VortECSProvider({ children }: { children: React.ReactNode }) {
	const vortECSInstance = useRef<VortECSInstance>(new VortECSInstance())

	const [initialized, setInitialized] = useState(false)

	useEffect(() => {
		Vort().then(async (module: any) => {
			vortECSInstance.current.module = module
			Object.assign(window, { __VORT: vortECSInstance.current })
			let a = module.globalGetAppState()

			while (a instanceof Promise) {
				try {
					await a
				} catch {}
				a = module.globalGetAppState()
			}
			vortECSInstance.current.initialized = true
			setInitialized(true)
		})
	}, [])

	return (
		<VortECSContext.Provider value={vortECSInstance.current}>
			{initialized ? (
				children
			) : (
				<div className="w-full h-screen fixed top-0 left-0 z-50 text-white flex justify-center items-center gap-x-3 bg-[#2c2c2c]">
					setting up scene <span className="w-3 h-3 border-2 border-white animate-spin"></span>
				</div>
			)}
		</VortECSContext.Provider>
	)
}

export function useInstance() {
	return useContext(VortECSContext)
}

export class Component {}

export class Position extends Component {
	constructor(public x: number, public y: number, public z: number) {
		super()
	}
	static get(entityID: number): Position {
		return new Position(0, 0, 0)
	}
}
export class Velocity extends Component {
	constructor(public x: number, public y: number, public z: number) {
		super()
	}
	static get(entityID: number): Velocity {
		return new Velocity(0, 0, 0)
	}
}

export function useEntityChildren(entityID: number): number[] {
	const instance = useInstance()

	const [children, setChildren] = useState<number[]>(() => instance.entityGetChildren(entityID))

	// TODO: register an handler to listen for changes to the entity children
	useEffect(() => {}, [])

	return children
}

export function useEntity(entityID: number): EntityInfo {
	const instance = useInstance()
	const [entityData, setEntityData] = useState<EntityInfo>(() => instance.entityGetInfo(entityID))
	return entityData
}

export const RootEntity = 0
