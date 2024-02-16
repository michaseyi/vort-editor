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

declare let Vort: any
declare let UTF8ToString: (rawStringPtr: number) => string

class VortECSInstance {
	private vortModule: any

	private callbacks: Map<ECSEvent, Set<Function>> = new Map()

	initialized: boolean = false

	isInitialzing: boolean = false

	entitiesRemoveEntity(entityID: number) {
		this.vortModule.entitiesRemoveEntity(entityID)
	}

	editorCameraZoom(zoomFactor: number) {
		this.vortModule.editorCameraZoom(zoomFactor)
	}

	editorCameraRotate(pitch: number, yaw: number) {
		this.vortModule.editorCameraRotate(pitch, yaw)
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
		if (!(this.initialized || this.isInitialzing)) {
			this.isInitialzing = true
			Object.assign(window, { __VORT_INSTANCE: this })
			this.vortModule = await Vort({ canvas })
			console.log("js cone")
			this.initialized = true
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
		if (!(instance.initialized || instance.isInitialzing) && container) {
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
	}

	return (
		<div ref={containerRef} className={`${className} overflow-hidden  relative`}>
			<canvas
				onWheel={(e) => {
					instance.editorCameraZoom(e.deltaY)
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
