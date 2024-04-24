import { useEffect, useReducer, useState } from "react"
import { AppState, ECSEvent, useInstance } from "."

export function useVortState(): AppState {
	const instance = useInstance()

	const [appState, setAppState] = useState(() => instance.globalGetAppState())

	useEffect(() => {
		let timeoutID: any
		function callback() {
			const newAppState = instance.globalGetAppState()
			if (!newAppState.initialized) {
				timeoutID = setTimeout(callback, 33)
			}
			setAppState(newAppState)
		}

		callback()
		return () => {
			if (timeoutID) {
				clearTimeout(timeoutID)
			}
		}
	}, [])

	return appState
}
