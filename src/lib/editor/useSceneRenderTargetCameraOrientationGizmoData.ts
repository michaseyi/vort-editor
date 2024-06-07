import { useEffect, useState } from "react"
import { GlobalUpdateKind, OrientationGizmoData } from "./types"
import { useEditorControls } from "./useEditorControls"
import { useEditorStore } from "./useEditorStore"

export function useSceneRenderTargetCameraOrientationGizmoData(
	renderTargetId: number
): OrientationGizmoData {
	const { getCameraOrientationGizmoDataFromSceneRenderTarget } = useEditorControls()
	const store = useEditorStore()
	const subscribeToGlobalUpdate = store.use.subscribeToGlobalUpdate()

	const [orientationGizmoData, setOrientationGizmoData] = useState<OrientationGizmoData>(() =>
		getCameraOrientationGizmoDataFromSceneRenderTarget(renderTargetId)
	)

	function onRenderTargetUpdate() {
		setOrientationGizmoData(getCameraOrientationGizmoDataFromSceneRenderTarget(renderTargetId))
	}

	useEffect(() => {
		const unsubscribe = subscribeToGlobalUpdate(
			GlobalUpdateKind.RenderTarget,
			onRenderTargetUpdate,
			renderTargetId
		)
		return () => {
			unsubscribe()
		}
	}, [])

	return orientationGizmoData
}
