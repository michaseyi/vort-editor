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

class VortECSInstance {
	private vortModule: any

	private callbacks: Map<ECSEvent, Set<Function>> = new Map()

	private initialized: boolean = false

	private initialzing: boolean = false

	private lastAppState: AppState = {
		initializationStage: "Creating World",
		running: true,
		initialized: false,
	}

	globalGetAppState(): AppState {
		if (!this.initialized || this.vortModule.Asyncify.asyncPromiseHandlers) {
			return this.lastAppState
		}

		let appStatePtr = this.vortModule.globalGetAppState()

		if (appStatePtr instanceof Promise) {
			return this.lastAppState
		}

		let initializationStagePtr = this.vortModule.HEAPU32.at((appStatePtr / 4) | 0)

		let initializationStage = this.vortModule.UTF8ToString(initializationStagePtr)
		let initialized = this.vortModule.HEAP8.at(appStatePtr + 4) === 1
		let running = this.vortModule.HEAP8.at(appStatePtr + 4 + 1) === 1
		this.lastAppState = { initializationStage, initialized, running }

		return this.lastAppState
	}
	entitiesRemoveEntity(entityID: number) {
		this.vortModule.entitiesRemoveEntity(entityID)
	}

	editorRotateCamera(pitch: number, yaw: number) {
		this.vortModule.editorRotateCamera(pitch, yaw)
	}

	editorMoveCamera(xChange: number, yChange: number, zChange: number) {
		this.vortModule.editorMoveCamera(xChange, yChange, zChange)
	}

	entityGetChildren(entityID: number): number[] {
		const result: number[] = []

		const entityChildren = this.vortModule.entityGetChildren(entityID)

		for (let i = 0; i < entityChildren.size(); i++) {
			result.push(entityChildren.get(i))
		}
		return result
	}

	entityGetInfo(entityID: number): EntityInfo {
		const entityInterface: EntityInterface = this.vortModule.entityGetInterface(entityID)
		const entityNamePtr = this.vortModule.entityGetName(entityID)
		const entityName = this.vortModule.UTF8ToString(entityNamePtr)

		return { name: entityName, interface: entityInterface }
	}
	private dispatch<T extends ECSEvent>(eventType: T, eventData: ECSEventsCallbackArgument<T>) {
		console.log(eventType, eventData)
	}

	setCanvasSize(width: number, height: number) {
		if (this.vortModule) {
			this.vortModule.setCanvasSize(width, height)
		}
	}

	async startRuntimeInitialization(canvas: HTMLCanvasElement) {
		let that = this
		if (!(this.initialized || this.initialzing)) {
			this.initialzing = true
			Object.assign(window, { __VORT_INSTANCE: this })
			this.vortModule = await Vort({
				canvas,
				onRuntimeInitialized: () => {
					that.initialized = true
				},
			})
		}
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

	return (
		<VortECSContext.Provider value={vortECSInstance.current}>{children}</VortECSContext.Provider>
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

export function RenderWindow({ className }: { className?: string }) {
	const instance = useInstance()

	const resizeObserver = useRef<ResizeObserver>()

	function containerRef(container: HTMLDivElement) {
		if (!container) {
			return
		}
		resizeObserver.current = new ResizeObserver((entries) => {
			entries.forEach((entry) => {
				const { width, height } = entry.contentRect
				instance.setCanvasSize(width * window.devicePixelRatio, height * window.devicePixelRatio)
			})
		})
		const { width, height } = container.getBoundingClientRect()

		const canvas = container.firstElementChild as HTMLCanvasElement

		canvas.width = width * window.devicePixelRatio
		canvas.height = height * window.devicePixelRatio

		resizeObserver.current?.observe(container)
		instance.startRuntimeInitialization(canvas)
	}

	return (
		<div ref={containerRef} className={`${className} overflow-hidden  relative`}>
			<canvas
				onWheel={(e) => {
					instance.editorMoveCamera(0, 0, e.deltaY)
				}}
				className="absolute top-0 left-0 emscripten w-full h-full"
				id="canvas"
			></canvas>
		</div>
	)
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
