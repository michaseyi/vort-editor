"use client"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tab } from "@/components/Tab"
import { NodeEditor } from "@/components/NodeEditor"
import { NumericInput } from "@/components/NumericInput"
import { Suspense, use, useEffect, useLayoutEffect, useState } from "react"
import { EditorProvider } from "@/lib/editor/EditorProvider"
import { useEditorStore } from "@/lib/editor/useEditorStore"
import { useEntityChildren } from "@/lib/editor/useEntityChildren"
import { useEntityComponent } from "@/lib/editor/useEntityComponent"
import { ComponentType } from "@/lib/editor/types"
import { Key, KeyProvider, KeyState, isPressed, isReleased, useKeys } from "@/lib/editor/keyStore"
import { useEditorControls } from "@/lib/editor/useEditorControls"

export default function Wrapper() {
	return (
		<EditorProvider>
			<KeyProvider>
				<Editor />
			</KeyProvider>
		</EditorProvider>
	)
}

function Editor() {
	const editorStore = useEditorStore()

	const onInitSignal = editorStore.use.onInitSignal()
	const initializationStage = editorStore.use.initializationStage()
	const engineError = editorStore.use.engineError()
	const clearEngineError = editorStore.use.clearEngineError()

	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		onInitSignal.completed().then(() => {
			setIsInitialized(true)
		})
	}, [])

	return (
		<>
			{engineError && (
				<div
					style={{
						backdropFilter: "blur(5px)",
						WebkitBackdropFilter: "blur(5px)",
					}}
					className="fixed top-0 left-0 w-full z-[100] h-screen grid place-items-center p-4"
				>
					<div className="animate-zoom-in bg-[#252525] p-6 rounded-lg shadow-lg max-w-md">
						<h2 className="text-2xl font-semibold text-red-400 mb-3">Oops!</h2>
						<p className="text-gray-300 text-sm mb-3">
							Hey there! It seems like we&apos;ve encountered some unexpected errors:
						</p>
						<p className="text-red-400 text-sm mb-3">{engineError.message}</p>
						<button
							onClick={() => window.location.reload()}
							className="block w-full px-3 py-1.5 text-sm bg-[#2c2c2c] text-gray-200 rounded-md hover:bg-[#424242] focus:outline-none focus:bg-[#2c2c2c]"
						>
							Reload
						</button>
					</div>
				</div>
			)}

			{!isInitialized && (
				<div className="h-screen flex flex-col gap-y-1 justify-center items-center bg-[#2c2c2c]">
					<span className="text-white/70 text-sm">{initializationStage}</span>
					<div className="w-48 h-1 rounded-l-full rounded-r-full bg-white/40 overflow-hidden">
						<div className="h-full animate-width bg-white/70"></div>
					</div>
				</div>
			)}

			{isInitialized && <EditorPage />}
		</>
	)
}

function EditorPage() {
	return (
		<div style={{ height: "100dvh" }} className=" bg-[rgb(28,28,28)] p-1">
			<ResizablePanelGroup direction="horizontal" className="gap-[1px]">
				<ResizablePanel defaultSize={85} minSize={5}>
					<Tab tabName="3D Viewport" />
				</ResizablePanel>
				<ResizableHandle className="bg-transparent" />
				<ResizablePanel defaultSize={15}>
					<ResizablePanelGroup direction="vertical" className="gap-[1px]">
						<ResizablePanel defaultSize={30}>
							<Tab tabName="Scene Graph" />
						</ResizablePanel>
						<ResizableHandle className="bg-transparent" />
						<ResizablePanel defaultSize={70}>
							<Tab tabName="Properties" />
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
			<KeyBoardShortcuts />
		</div>
	)
}

function KeyBoardShortcuts() {
	const keys = useKeys()

	const shift = keys.use.Shift()
	const x = keys.use.KeyX()

	const editorStore = useEditorStore()

	const lastSelectedEntity = editorStore.use.lastSelectedEntity()

	const { removeEntity } = useEditorControls()

	useEffect(() => {
		if (isPressed(shift) && isPressed(x) && lastSelectedEntity) {
			removeEntity(lastSelectedEntity)
			return
		}
	}, [shift, x])

	return <></>
}
