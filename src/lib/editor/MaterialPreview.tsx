import { useSceneRenderTarget } from "./useSceneRenderTarget"


type MaterialPreviewProps = {
	materialIndex: number
}

function MaterialPreview() {
	const [ready, canvasId, renderTargetId] = useSceneRenderTarget()

	return (
		<div>
			<canvas id={canvasId} />
		</div>
	)
}
