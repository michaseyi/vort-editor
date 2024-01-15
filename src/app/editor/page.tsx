"use client"
import {
	Canvas,
	VortECSProvider,
	useInstance,
	useEntityComponent,
	Position,
	Velocity,
	useLoadingState,
} from "@/vort-ecs-connector"
import { useEffect, useRef, useState } from "react"

function EditorPage() {
	const { isInitialized, initializationStage } = useLoadingState()

	const { position, velocity, set } = useEntityComponent(1, {
		position: {
			type: Position,
		},
		velocity: { type: Velocity },
	})

	console.log(position, velocity, set)

	useEffect(() => {
		set({
			position: { x: 2 },
		})
	}, [])
	return (
		<>
			{!isInitialized && (
				<div className="fixed top-0 left-0 w-screen h-screen z-10 grid place-items-center bg-black">
					{initializationStage}
				</div>
			)}
			<Canvas className="w-screen h-screen" />

			<aside className="absolute overflow-hidden top-0 left-0 h-screen bg-black min-w-60 pl-4 py-2">
				<SceneGraph />
			</aside>
		</>
	)
}

type SceneEntityProps = {
	root?: boolean
}

function SceneEntity({ root = false }: SceneEntityProps) {
	const [children, setChildren] = useState<number[]>([1, 2, 3, 4, 5, 6])
	const [expanded, setExpanded] = useState(false)
	return (
		<section>
			<div
				onClick={() => {
					setExpanded((prev) => !prev)
				}}
				className="cursor-pointer relative"
			>
				entity
				{!root && <span className="absolute top-[50%] right-[100%] w-3 h-[1px] bg-white"></span>}
			</div>

			<div className="pl-4 relative">
				{expanded && children.map((entityId) => <SceneEntity key={entityId} />)}

				{expanded && (
					<span className="absolute bottom-3 left-1 block h-[calc(100%-7px)] w-[1px] bg-white"></span>
				)}
			</div>
		</section>
	)
}

function SceneGraph() {
	const scenes = [1, 2, 3]

	return (
		<>
			<search>
				<input type="text" id="entitySearchInput" className="bg-gray-900" />
			</search>
			<div className="overflow-auto h-full no-scrollbar">
				{scenes.map((entityId) => (
					<SceneEntity key={entityId} root={true} />
				))}
			</div>
		</>
	)
}
export default () => {
	return (
		<VortECSProvider>
			<EditorPage />
		</VortECSProvider>
	)
}
