import { useEffect, useReducer, useState } from "react"
import { ECSEvent, useInstance } from "."

export function useLoadingState() {
	const { addEventListener, removeEventListener } = useInstance()

	const [isInitialized, setIsInitialized] = useState(false)

	const [initializationStage, setInitializationStage] = useState("Initializing Wasm Module.")

	useEffect(() => {
		function onRuntimeInitializedCallback({ initialized }: { initialized: boolean }) {
			setIsInitialized(initialized)
		}
		addEventListener(ECSEvent.ON_RUNTIME_INITIALIZED, onRuntimeInitializedCallback)

		return () => {
			removeEventListener(ECSEvent.ON_RUNTIME_INITIALIZED, onRuntimeInitializedCallback)
		}
	}, [])

	return { isInitialized, initializationStage }
}
