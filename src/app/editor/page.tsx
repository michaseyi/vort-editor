"use client"
import { ViewGizmos } from "@/components/ViewGizmos"
import { BoundingBoxSelector } from "@/components/BoundingBoxSelector"
import { RenderWindow, VortECSProvider, useInstance, useVortState } from "@/vort-ecs-connector"
import { useMediaQuery } from "../../hooks/useMediaQuery"
import { EntityGraph } from "@/components/EntityGraph"
import { VectorInput } from "@/components/VectorInput"
import { useRef } from "react"

export default function EditorPageWrapper() {
	return (
		<VortECSProvider>
			<EditorPage />
		</VortECSProvider>
	)
}

function EditorPage() {
	const { initializationStage, initialized } = useVortState()
	return (
		<>
			{!initialized && (
				<div className="w-full h-screen fixed top-0 left-0 z-50 text-white flex justify-center items-center gap-x-3 bg-[#2c2c2c]">
					{initializationStage} <span className="w-3 h-3 border-2 border-white animate-spin"></span>
				</div>
			)}
			<div className="flex flex-col h-screen divide-y divide-[#444]">
				<TopPanel />
				<div className="flex-1 flex divide-x divide-[#444] min-h-0">
					<BoundingBoxSelector
						className="flex-1 relative"
						showHelperBox={true}
						onBoxAvailable={(box) => {
							console.log(box)
						}}
					>
						<RenderWindow className="bg-black w-full h-full " />
						<div className="absolute top-5 right-6  space-y-4 flex flex-col items-end">
							<ViewGizmos />

							{/* Controls */}
							<div className="flex flex-col items-end">
								<MoveView />
							</div>
						</div>
					</BoundingBoxSelector>

					<RightPanel />
				</div>
			</div>
		</>
	)
}

function MoveView() {
	const instance = useInstance()

	const capturePointer = useRef(false)

	return (
		<span
			onPointerDown={(e) => {
				e.stopPropagation()
				capturePointer.current = true
			}}
			onPointerMove={(e) => {
				if (!capturePointer.current) {
					return
				}

				if (document.pointerLockElement !== e.currentTarget) {
					e.currentTarget.requestPointerLock()
				}
				const { movementX, movementY } = e
				instance.editorMoveCamera(-movementX, movementY, 0)
			}}
			onPointerUp={() => {
				capturePointer.current = false
				document.exitPointerLock()
			}}
			onPointerLeave={(e) => {
				capturePointer.current = false
				document.exitPointerLock()
			}}
			className="text-white select-none"
		>
			Move
		</span>
	)
}

function RightPanel() {
	const { initialized } = useVortState()
	return (
		<section className="bg-[#2c2c2c] min-w-60 divide-y divide-[#444] flex flex-col">
			{initialized && (
				<>
					<EntityGraph />
					<div className="flex-1">
						<VectorInput<2> size={2} value={{ x: 0, y: 0 }} />
					</div>
				</>
			)}
		</section>
	)
}
function TopPanel() {
	return <header className="min-h-12 bg-[#2c2c2c]"></header>
}

function LeftPanel() {
	return <section className="bg-[#2c2c2c] min-w-60 divide-y divide-[#444]"></section>
}
