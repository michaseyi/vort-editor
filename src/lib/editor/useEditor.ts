import { useEffect, useRef } from "react"
import { createEditorStore } from "./editorStore"
import { ComponentType, EditorState } from "./types"
import { EditorModuleWrapper } from "./editorModuleWrapper"
import { EditorContextType } from "./types"

export function useEditor(initProps: Partial<EditorState>): EditorContextType {
	const store = useRef(createEditorStore(initProps)).current

	const editorModule = useRef(new EditorModuleWrapper()).current

	const onInitSignal = store.use.onInitSignal()
	const setInitializationStage = store.use.setInitializationStage()
	const setEngineError = store.use.setEngineError()
	const dispatchEntityUpdate = store.use.dispatchEntityUpdate()
	const dispatchGlobalUpdate = store.use.dispatchGlobalUpdate()

	function initWasm() {
		
		// TODO: Figure out better way to handle this, This is just a temporary solution
		const entityRemover = editorModule.removeEntity
		editorModule.removeEntity = (entityId: number) => {
			const state = store.getState()
			if (state.lastSelectedEntity === entityId) {
				store.setState({ lastSelectedEntity: null })
			}
			if (state.selectedEntities.has(entityId)) {
				const selectedEntities = new Set(state.selectedEntities)
				selectedEntities.delete(entityId)
				store.setState({ selectedEntities })
			}

			entityRemover(entityId)
		}

		window.__editor_callbacks__ = {
			onInitialized: () => {
				onInitSignal.finish()
			},

			onInitializationStageChange(stage) {
				setInitializationStage(stage)
			},

			onEngineError: (cause) => {
				setEngineError(cause)
			},

			onEntityUpdate: (entityId, kind) => {
				dispatchEntityUpdate(entityId, kind)
			},

			onGlobalUpdate: (kind, data) => {
				dispatchGlobalUpdate(kind, data)
			},
		}

		window.__editor_module_factory__().then((mainModule) => {
			editorModule.setModule(mainModule)
			window.__editor_module__ = editorModule
		})

		store.setState({
			componentActors: new Map([
				[
					ComponentType.Position,
					{
						getter: editorModule.getEntityPosition,
						setter: editorModule.setEntityPosition,
					},
				],

				[
					ComponentType.Scale,
					{
						getter: editorModule.getEntityScale,
						setter: editorModule.setEntityScale,
					},
				],

				[
					ComponentType.Orientation,
					{
						getter: editorModule.getEntityOrientation,
						setter: editorModule.setEntityOrientation,
					},
				],
			]),
		})
	}

	useEffect(() => {
		initWasm()
	}, [])

	return { store, editorModule }
}
