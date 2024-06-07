import { useEffect, useMemo, useRef, useState } from "react"
import { useEditorControls } from "./useEditorControls"

export function useSceneRenderTarget(): [boolean, string, number, () => void] {
	const {
		createSceneRenderTarget,
		removeSceneRenderTarget,
		triggerSceneRenderTargetUpdate,
		jsStringToPtr,
	} = useEditorControls()

	const canvasId = useMemo(() => {
		return `s${crypto.randomUUID()}`
	}, [])

	const canvasSelectorPtr = useMemo(() => {
		return jsStringToPtr(`#${canvasId}`)
	}, [])

	const [isReady, setIsReady] = useState(false)

	function update() {
		triggerSceneRenderTargetUpdate(canvasSelectorPtr)
	}

	useEffect(() => {
		const canvas = document.getElementById(canvasId) as HTMLCanvasElement
		const container = canvas.parentElement as HTMLElement

		const { width, height } = container.getBoundingClientRect()

		canvas._height = height * window.devicePixelRatio
		canvas._width = width * window.devicePixelRatio

		canvas.style.width = `${width}px`
		canvas.style.height = `${height}px`

		const observer = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect
			const canvas = document.getElementById(canvasId) as HTMLCanvasElement

			canvas._width = width * window.devicePixelRatio
			canvas._height = height * window.devicePixelRatio
			triggerSceneRenderTargetUpdate(canvasSelectorPtr)
		})

		observer.observe(container)

		createSceneRenderTarget(canvasSelectorPtr)
		setIsReady(true)
		return () => {
			observer.disconnect()
			removeSceneRenderTarget(canvasSelectorPtr)
		}
	}, [])

	return [isReady, canvasId, canvasSelectorPtr, update]
}
