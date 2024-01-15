import { ComponentType, HTMLAttributes, createContext, use, useContext, useRef } from "react"

import Module from "@/emscripten/App.js"

export enum ECSEvent {
	ON_ENTITY_COMPONENT_CHANGE,
	ON_GLOBAL_VARIABLE_CHANGE,
	ON_ENTITY_CHILDCOUNT_CHANGE,
	ON_RUNTIME_INITIALIZED,
}

class VortECSInstance {
	private emscriptenModuleInstance: any

	private callbacks: Map<ECSEvent, Set<Function>> = new Map()

	initialized: boolean = false

	private dispatch<T extends ECSEvent>(eventType: T, eventData: ECSEventsCallbackArgument<T>) {}

	async startRuntimeInitialization(window: HTMLCanvasElement) {
		// window.vvv = this
		this.emscriptenModuleInstance = await Module({ canvas: window })
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

declare global {
	interface Window {
		channel: Channel
	}
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

class Channel {
	constructor(public sendImpl: (v: string) => void) {}
	send(data: string) {
		this.sendImpl(data)
	}
}

export function VortECSProvider({ children }: { children: React.ReactNode }) {
	const vortECSInstance = useRef<VortECSInstance>(new VortECSInstance())

	return (
		<VortECSContext.Provider value={vortECSInstance.current}>{children}</VortECSContext.Provider>
	)
}

export function Canvas({ ...props }: HTMLAttributes<HTMLCanvasElement>) {
	const instance = useInstance()

	const resizeObserver = useRef(
		new ResizeObserver((entries) => {
			entries.forEach((entry) => {
				console.log(entry)
			})
		})
	)
	function canvasRefCallback(canvas: HTMLCanvasElement) {
		if (!instance.initialized && canvas) {
			const { width, height } = canvas.getBoundingClientRect()
			canvas.width = width
			canvas.height = height
			resizeObserver.current.observe(canvas)
			instance.startRuntimeInitialization(canvas)
		}
	}
	return <canvas {...props} ref={canvasRefCallback} id="canvas"></canvas>
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
